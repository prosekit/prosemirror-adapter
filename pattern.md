# Migration Pattern: 泛型化 Abstract View 类与 Creator 函数重构

本文档基于 commit `58d5106` 对 `markView` 的改动，抽象出一套可复用的迁移 pattern，用于将其他类似的 API（如 `nodeView`、`pluginView`）迁移到相同的结构。

---

## 概述

核心改动目标：将 Abstract View 类和对应的 Creator 工厂函数从**硬编码具体类型**改为**泛型参数化**，同时将 Creator 内部的对象构造逻辑从**内联传参**改为**分步构造中间变量**。

---

## 改动 1：Abstract 类添加泛型参数

### Before

```ts
export abstract class AbstractReactMarkView
  extends CoreMarkView<ReactMarkViewComponent>
  implements ReactRenderer<MarkViewContext>
{
```

- `AbstractReactMarkView` 没有泛型参数
- 父类 `CoreMarkView` 的泛型参数被硬编码为具体类型 `ReactMarkViewComponent`

### After

```ts
export abstract class AbstractReactMarkView<ComponentType>
  extends CoreMarkView<ComponentType>
  implements ReactRenderer<MarkViewContext>
{
```

- `AbstractReactMarkView` 新增泛型参数 `<ComponentType>`
- 父类 `CoreMarkView` 的泛型参数改为透传 `ComponentType`

### 规则

1. 泛型参数命名为 `ComponentType`
2. 泛型参数加在类名之后：`AbstractReactXxxView<ComponentType>`
3. 父类 `CoreXxxView<具体类型>` 改为 `CoreXxxView<ComponentType>`
4. `implements` 子句保持不变，不需要添加泛型参数

---

## 改动 2：具体子类显式传入具体类型

### Before

```ts
export class ReactMarkView extends AbstractReactMarkView implements ReactRenderer<MarkViewContext> {
```

- 单行声明
- 未显式传入泛型参数（因为父类之前没有泛型参数）

### After

```ts
export class ReactMarkView
  extends AbstractReactMarkView<ReactMarkViewComponent>
  implements ReactRenderer<MarkViewContext>
{
```

- 多行声明
- 显式传入具体类型 `ReactMarkViewComponent`

### 格式规则

子类声明必须拆成多行，格式为：

```
export class ReactXxxView
  extends AbstractReactXxxView<ReactXxxViewComponent>
  implements ReactRenderer<XxxViewContext>
{
```

- 第 1 行：`export class ReactXxxView`
- 第 2 行：缩进 2 空格 + `extends AbstractReactXxxView<ReactXxxViewComponent>`
- 第 3 行：缩进 2 空格 + `implements ReactRenderer<XxxViewContext>`
- 第 4 行：`{` 单独占一行

---

## 改动 3：Creator 工厂函数泛型化

### Before

```ts
export function buildReactMarkViewCreator(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
  ReactMarkViewClass: new (...args: ConstructorParameters<typeof AbstractReactMarkView>) => AbstractReactMarkView,
) {
```

- 函数没有泛型参数
- `ReactMarkViewClass` 构造器签名使用 `ConstructorParameters<typeof AbstractReactMarkView>` 来推导参数类型
- 返回类型中 `AbstractReactMarkView` 没有泛型参数

### After

```ts
export function buildReactMarkViewCreator<ComponentType>(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
  ReactMarkViewClass: new (spec: CoreMarkViewSpec<ComponentType>) => AbstractReactMarkView<ComponentType>,
) {
```

- 函数添加泛型参数 `<ComponentType>`
- `ReactMarkViewClass` 构造器签名改为显式的 `(spec: CoreXxxViewSpec<ComponentType>)`，不再使用 `ConstructorParameters`
- `AbstractReactMarkView` 改为 `AbstractReactMarkView<ComponentType>`

### 规则

1. 函数泛型参数命名为 `ComponentType`，与 Abstract 类的泛型参数保持一致
2. 构造器参数类型从 `ConstructorParameters<typeof AbstractReactXxxView>` 改为 `(spec: CoreXxxViewSpec<ComponentType>)`
3. 返回类型中所有 `AbstractReactXxxView` 都附加 `<ComponentType>`

---

## 改动 4：Creator 内部参数名 `options` → `userOptions`

### Before

```ts
return function markViewCreator(options: ReactMarkViewUserOptions): MarkViewConstructor {
```

### After

```ts
return function markViewCreator(userOptions: CoreMarkViewUserOptions<ComponentType>): MarkViewConstructor {
```

### 规则

1. 参数名从 `options` 改为 `userOptions`
2. 类型从框架特定的 `ReactXxxViewUserOptions` 改为 core 泛型类型 `CoreXxxViewUserOptions<ComponentType>`
3. 函数体内所有对 `options` 的引用都要改为 `userOptions`

---

## 改动 5：import 语句调整

### Before

```ts
import type { ReactMarkViewUserOptions } from './ReactMarkViewOptions'
```

### After

```ts
import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'
```

（删除了 `ReactMarkViewUserOptions` 的 import）

### 规则

1. 新增从 `@prosemirror-adapter/core` 导入 `CoreXxxViewSpec` 和 `CoreXxxViewUserOptions`
2. 删除原本从 `./ReactXxxViewOptions` 导入的 `ReactXxxViewUserOptions`（因为不再使用）
3. 新增的 import 语句放在文件**最顶部**（在其他 import 之前），按模块路径排序：`@prosemirror-adapter/core` 在 `prosemirror-view` 之前
4. import 使用 `import type` 语法

---

## 改动 6：对象构造从内联改为分步构造

### Before

```ts
return function markViewConstructor(mark, view, inline) {
  const markView = new ReactMarkViewClass({
    mark,
    view,
    inline,
    options: {
      ...options,
      destroy() {
        options.destroy?.()
        removeReactRenderer(markView)
      },
    },
  })
  renderReactRenderer(markView, false)

  return markView
}
```

- `ReactMarkViewClass` 的构造参数以内联对象字面量形式传入
- `options` 的 patching 嵌套在构造参数内部
- `renderReactRenderer` 和 `return` 之间有一个空行

### After

```ts
return function markViewConstructor(mark, view, inline) {
  const patchedUserOptions: CoreMarkViewUserOptions<ComponentType> = {
    ...userOptions,
    destroy() {
      userOptions.destroy?.()
      removeReactRenderer(markView)
    },
  }
  const spec: CoreMarkViewSpec<ComponentType> = {
    mark,
    view,
    inline,
    options: patchedUserOptions,
  }
  const markView = new ReactMarkViewClass(spec)
  renderReactRenderer(markView, false)
  return markView
}
```

### 规则

1. **第一步**：构造 `patchedUserOptions` 变量
   - 变量名固定为 `patchedUserOptions`
   - 类型标注为 `CoreXxxViewUserOptions<ComponentType>`
   - 展开 `userOptions`，然后覆写需要 patch 的回调方法
   - 每个被 patch 的回调方法内部，先调用 `userOptions.xxx?.()` 再调用框架方法

2. **第二步**：构造 `spec` 变量
   - 变量名固定为 `spec`
   - 类型标注为 `CoreXxxViewSpec<ComponentType>`
   - 包含 prosemirror 原生参数（如 `mark`, `view`, `inline` 等）
   - `options` 字段引用上一步的 `patchedUserOptions`

3. **第三步**：调用构造函数
   - `new ReactXxxViewClass(spec)`，只传 `spec` 一个参数

4. **空行规则**：
   - `patchedUserOptions` 和 `spec` 之间：**无空行**（`}` 紧接下一行 `const spec`）
   - `spec` 和 `new` 之间：**无空行**
   - `new` 和 `renderReactRenderer` 之间：**无空行**
   - `renderReactRenderer` 和 `return` 之间：**无空行**（改动前有空行，改动后删除）

---

## 改动 7：删除多余空行

### Before

```ts
      renderReactRenderer(markView, false)

      return markView
```

### After

```ts
      renderReactRenderer(markView, false)
      return markView
```

### 规则

`renderReactRenderer` 调用和 `return` 语句之间不留空行。

---

## 完整迁移 Checklist

以 `nodeView` 为例，按以下顺序执行迁移：

### ReactXxxView.ts

- [ ] `AbstractReactXxxView` 添加泛型参数 `<ComponentType>`
- [ ] 父类 `CoreXxxView<具体类型>` 改为 `CoreXxxView<ComponentType>`
- [ ] 具体子类 `ReactXxxView` 显式传入具体类型给 `AbstractReactXxxView<ReactXxxViewComponent>`
- [ ] 子类声明拆成多行（`class` / `extends` / `implements` / `{` 各占一行）

### useReactXxxViewCreator.ts

- [ ] 新增 `import type { CoreXxxViewSpec, CoreXxxViewUserOptions } from '@prosemirror-adapter/core'`，放在文件最顶部
- [ ] 删除 `import type { ReactXxxViewUserOptions } from './ReactXxxViewOptions'`
- [ ] `buildReactXxxViewCreator` 函数添加泛型参数 `<ComponentType>`
- [ ] `ReactXxxViewClass` 构造器签名改为 `new (spec: CoreXxxViewSpec<ComponentType>) => AbstractReactXxxView<ComponentType>`
- [ ] `markViewCreator` / `nodeViewCreator` 的参数名从 `options` 改为 `userOptions`
- [ ] 参数类型从 `ReactXxxViewUserOptions` 改为 `CoreXxxViewUserOptions<ComponentType>`
- [ ] 函数体内 `options` 引用全部改为 `userOptions`
- [ ] 构造函数调用从内联对象改为分步构造：先 `patchedUserOptions`，再 `spec`，最后 `new`
- [ ] 删除 `renderReactRenderer` 和 `return` 之间的空行

---

## 命名约定汇总

| 概念 | 命名 |
|---|---|
| 泛型参数 | `ComponentType` |
| 用户传入的选项参数 | `userOptions` |
| patch 后的用户选项变量 | `patchedUserOptions` |
| 构造函数的 spec 变量 | `spec` |
| 用户选项类型 | `CoreXxxViewUserOptions<ComponentType>` |
| 构造 spec 类型 | `CoreXxxViewSpec<ComponentType>` |
| 抽象基类 | `AbstractReactXxxView<ComponentType>` |
| 具体子类 | `ReactXxxView extends AbstractReactXxxView<ReactXxxViewComponent>` |

# Migration Plan: 泛型化 Abstract View 类与 Creator 函数重构

基于 `pattern.md` 中定义的迁移规则，以下是所有需要改动的文件及具体操作。

已完成的参考实现：
- `packages/react/src/markView/ReactMarkView.ts` ✅
- `packages/react/src/markView/useReactMarkViewCreator.ts` ✅

---

## 1. packages/react/src/nodeView/ReactNodeView.ts

### 1.1 Abstract 类添加泛型参数（pattern 改动 1）

```ts
// Before
export abstract class AbstractReactNodeView
  extends CoreNodeView<ReactNodeViewComponent>
  implements ReactRenderer<NodeViewContext>
{

// After
export abstract class AbstractReactNodeView<ComponentType>
  extends CoreNodeView<ComponentType>
  implements ReactRenderer<NodeViewContext>
{
```

### 1.2 具体子类显式传入具体类型 + 多行格式（pattern 改动 2）

```ts
// Before
export class ReactNodeView extends AbstractReactNodeView implements ReactRenderer<NodeViewContext> {

// After
export class ReactNodeView
  extends AbstractReactNodeView<ReactNodeViewComponent>
  implements ReactRenderer<NodeViewContext>
{
```

---

## 2. packages/react/src/nodeView/useReactNodeViewCreator.ts

### 2.1 import 语句调整（pattern 改动 5）

```ts
// 新增（放在文件最顶部）
import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'

// 删除
import type { ReactNodeViewUserOptions } from './ReactNodeViewOptions'
```

### 2.2 函数泛型化 + 构造器签名（pattern 改动 3）

```ts
// Before
export function buildReactNodeViewCreator(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
  ReactNodeViewClass: new (...args: ConstructorParameters<typeof AbstractReactNodeView>) => AbstractReactNodeView,
) {

// After
export function buildReactNodeViewCreator<ComponentType>(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
  ReactNodeViewClass: new (spec: CoreNodeViewSpec<ComponentType>) => AbstractReactNodeView<ComponentType>,
) {
```

### 2.3 参数名 `options` → `userOptions`（pattern 改动 4）

```ts
// Before
return function nodeViewCreator(options: ReactNodeViewUserOptions): NodeViewConstructor {

// After
return function nodeViewCreator(userOptions: CoreNodeViewUserOptions<ComponentType>): NodeViewConstructor {
```

### 2.4 对象构造从内联改为分步（pattern 改动 6）+ 删除多余空行（pattern 改动 7）

```ts
// Before
return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
  const nodeView = new ReactNodeViewClass({
    node,
    view,
    getPos,
    decorations,
    innerDecorations,
    options: {
      ...options,
      onUpdate() {
        options.onUpdate?.()
        renderReactRenderer(nodeView)
      },
      selectNode() {
        options.selectNode?.()
        renderReactRenderer(nodeView)
      },
      deselectNode() {
        options.deselectNode?.()
        renderReactRenderer(nodeView)
      },
      destroy() {
        options.destroy?.()
        removeReactRenderer(nodeView)
      },
    },
  })

  renderReactRenderer(nodeView, false)

  return nodeView
}

// After
return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
  const patchedUserOptions: CoreNodeViewUserOptions<ComponentType> = {
    ...userOptions,
    onUpdate() {
      userOptions.onUpdate?.()
      renderReactRenderer(nodeView)
    },
    selectNode() {
      userOptions.selectNode?.()
      renderReactRenderer(nodeView)
    },
    deselectNode() {
      userOptions.deselectNode?.()
      renderReactRenderer(nodeView)
    },
    destroy() {
      userOptions.destroy?.()
      removeReactRenderer(nodeView)
    },
  }
  const spec: CoreNodeViewSpec<ComponentType> = {
    node,
    view,
    getPos,
    decorations,
    innerDecorations,
    options: patchedUserOptions,
  }
  const nodeView = new ReactNodeViewClass(spec)
  renderReactRenderer(nodeView, false)
  return nodeView
}
```

---

## 3. packages/vue/src/markView/VueMarkView.ts

### 3.1 Abstract 类添加泛型参数（pattern 改动 1）

```ts
// Before
export abstract class AbstractVueMarkView
  extends CoreMarkView<VueMarkViewComponent>
  implements VueRenderer<MarkViewContext>
{

// After
export abstract class AbstractVueMarkView<ComponentType>
  extends CoreMarkView<ComponentType>
  implements VueRenderer<MarkViewContext>
{
```

### 3.2 具体子类显式传入具体类型 + 多行格式（pattern 改动 2）

```ts
// Before
export class VueMarkView extends AbstractVueMarkView implements VueRenderer<MarkViewContext> {

// After
export class VueMarkView
  extends AbstractVueMarkView<VueMarkViewComponent>
  implements VueRenderer<MarkViewContext>
{
```

---

## 4. packages/vue/src/markView/useVueMarkViewCreator.ts

### 4.1 import 语句调整（pattern 改动 5）

```ts
// 新增（放在文件最顶部）
import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'

// 删除
import type { VueMarkViewUserOptions } from './VueMarkViewOptions'
```

### 4.2 函数泛型化 + 构造器签名（pattern 改动 3）

```ts
// Before
export function buildVueMarkViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
  VueMarkViewClass: new (...args: ConstructorParameters<typeof AbstractVueMarkView>) => AbstractVueMarkView,
) {

// After
export function buildVueMarkViewCreator<ComponentType>(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
  VueMarkViewClass: new (spec: CoreMarkViewSpec<ComponentType>) => AbstractVueMarkView<ComponentType>,
) {
```

### 4.3 参数名 `options` → `userOptions`（pattern 改动 4）

```ts
// Before
return function markViewCreator(options: VueMarkViewUserOptions): MarkViewConstructor {

// After
return function markViewCreator(userOptions: CoreMarkViewUserOptions<ComponentType>): MarkViewConstructor {
```

### 4.4 对象构造从内联改为分步（pattern 改动 6）+ 删除多余空行（pattern 改动 7）

```ts
// Before
return function markViewConstructor(mark, view, inline) {
  const markView = new VueMarkViewClass({
    mark,
    view,
    inline,
    options: {
      ...options,
      destroy() {
        options.destroy?.()
        removeVueRenderer(markView)
      },
    },
  })
  renderVueRenderer(markView)

  return markView
}

// After
return function markViewConstructor(mark, view, inline) {
  const patchedUserOptions: CoreMarkViewUserOptions<ComponentType> = {
    ...userOptions,
    destroy() {
      userOptions.destroy?.()
      removeVueRenderer(markView)
    },
  }
  const spec: CoreMarkViewSpec<ComponentType> = {
    mark,
    view,
    inline,
    options: patchedUserOptions,
  }
  const markView = new VueMarkViewClass(spec)
  renderVueRenderer(markView)
  return markView
}
```

---

## 5. packages/vue/src/nodeView/VueNodeView.ts

### 5.1 Abstract 类添加泛型参数（pattern 改动 1）

```ts
// Before
export abstract class AbstractVueNodeView
  extends CoreNodeView<VueNodeViewComponent>
  implements VueRenderer<NodeViewContext>
{

// After
export abstract class AbstractVueNodeView<ComponentType>
  extends CoreNodeView<ComponentType>
  implements VueRenderer<NodeViewContext>
{
```

### 5.2 具体子类显式传入具体类型 + 多行格式（pattern 改动 2）

```ts
// Before
export class VueNodeView extends AbstractVueNodeView implements VueRenderer<NodeViewContext> {

// After
export class VueNodeView
  extends AbstractVueNodeView<VueNodeViewComponent>
  implements VueRenderer<NodeViewContext>
{
```

---

## 6. packages/vue/src/nodeView/useVueNodeViewCreator.ts

### 6.1 import 语句调整（pattern 改动 5）

```ts
// 新增（放在文件最顶部）
import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'

// 删除
import type { VueNodeViewUserOptions } from './VueNodeViewOptions'
```

### 6.2 函数泛型化 + 构造器签名（pattern 改动 3）

```ts
// Before
export function buildVueNodeViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
  VueNodeViewClass: new (...args: ConstructorParameters<typeof AbstractVueNodeView>) => AbstractVueNodeView,
) {

// After
export function buildVueNodeViewCreator<ComponentType>(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
  VueNodeViewClass: new (spec: CoreNodeViewSpec<ComponentType>) => AbstractVueNodeView<ComponentType>,
) {
```

### 6.3 参数名 `options` → `userOptions`（pattern 改动 4）

```ts
// Before
return function nodeViewCreator(options: VueNodeViewUserOptions): NodeViewConstructor {

// After
return function nodeViewCreator(userOptions: CoreNodeViewUserOptions<ComponentType>): NodeViewConstructor {
```

### 6.4 对象构造从内联改为分步（pattern 改动 6）+ 删除多余空行（pattern 改动 7）

```ts
// Before
return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
  const nodeView = new VueNodeViewClass({
    node,
    view,
    getPos,
    decorations,
    innerDecorations,
    options: {
      ...options,
      onUpdate() {
        options.onUpdate?.()
        nodeView.updateContext()
      },
      selectNode() {
        options.selectNode?.()
        nodeView.updateContext()
      },
      deselectNode() {
        options.deselectNode?.()
        nodeView.updateContext()
      },
      destroy() {
        options.destroy?.()
        removeVueRenderer(nodeView)
      },
    },
  })
  renderVueRenderer(nodeView)

  return nodeView
}

// After
return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
  const patchedUserOptions: CoreNodeViewUserOptions<ComponentType> = {
    ...userOptions,
    onUpdate() {
      userOptions.onUpdate?.()
      nodeView.updateContext()
    },
    selectNode() {
      userOptions.selectNode?.()
      nodeView.updateContext()
    },
    deselectNode() {
      userOptions.deselectNode?.()
      nodeView.updateContext()
    },
    destroy() {
      userOptions.destroy?.()
      removeVueRenderer(nodeView)
    },
  }
  const spec: CoreNodeViewSpec<ComponentType> = {
    node,
    view,
    getPos,
    decorations,
    innerDecorations,
    options: patchedUserOptions,
  }
  const nodeView = new VueNodeViewClass(spec)
  renderVueRenderer(nodeView)
  return nodeView
}
```

---

## 7. packages/svelte/src/markView/SvelteMarkView.ts

### 7.1 Abstract 类添加泛型参数（pattern 改动 1）

```ts
// Before
export abstract class AbstractSvelteMarkView
  extends CoreMarkView<SvelteMarkViewComponent>
  implements SvelteRenderer<MarkViewContext>
{

// After
export abstract class AbstractSvelteMarkView<ComponentType>
  extends CoreMarkView<ComponentType>
  implements SvelteRenderer<MarkViewContext>
{
```

### 7.2 具体子类显式传入具体类型 + 多行格式（pattern 改动 2）

```ts
// Before
export class SvelteMarkView extends AbstractSvelteMarkView implements SvelteRenderer<MarkViewContext> {

// After
export class SvelteMarkView
  extends AbstractSvelteMarkView<SvelteMarkViewComponent>
  implements SvelteRenderer<MarkViewContext>
{
```

---

## 8. packages/svelte/src/markView/useSvelteMarkViewCreator.ts

### 8.1 import 语句调整（pattern 改动 5）

```ts
// 新增（放在文件最顶部）
import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'

// 删除
import type { SvelteMarkViewUserOptions } from './SvelteMarkViewOptions'
```

### 8.2 函数泛型化 + 构造器签名（pattern 改动 3）

```ts
// Before
export function buildSvelteMarkViewCreator(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
  SvelteMarkViewClass: new (...args: ConstructorParameters<typeof AbstractSvelteMarkView>) => AbstractSvelteMarkView,
  context: Map<any, any>,
) {

// After
export function buildSvelteMarkViewCreator<ComponentType>(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
  SvelteMarkViewClass: new (spec: CoreMarkViewSpec<ComponentType>) => AbstractSvelteMarkView<ComponentType>,
  context: Map<any, any>,
) {
```

注意：Svelte 的 creator 有额外的 `context: Map<any, any>` 参数，迁移时保留。

### 8.3 参数名 `options` → `userOptions`（pattern 改动 4）

```ts
// Before
return function markViewCreator(options: SvelteMarkViewUserOptions): MarkViewConstructor {

// After
return function markViewCreator(userOptions: CoreMarkViewUserOptions<ComponentType>): MarkViewConstructor {
```

### 8.4 对象构造从内联改为分步（pattern 改动 6）+ 删除多余空行（pattern 改动 7）

```ts
// Before
return function markViewConstructor(mark, view, inline) {
  const markView = new SvelteMarkViewClass({
    mark,
    view,
    inline,
    options: {
      ...options,
      destroy() {
        options.destroy?.()
        removeSvelteRenderer(markView)
      },
    },
  })
  renderSvelteRenderer(markView, { context })

  return markView
}

// After
return function markViewConstructor(mark, view, inline) {
  const patchedUserOptions: CoreMarkViewUserOptions<ComponentType> = {
    ...userOptions,
    destroy() {
      userOptions.destroy?.()
      removeSvelteRenderer(markView)
    },
  }
  const spec: CoreMarkViewSpec<ComponentType> = {
    mark,
    view,
    inline,
    options: patchedUserOptions,
  }
  const markView = new SvelteMarkViewClass(spec)
  renderSvelteRenderer(markView, { context })
  return markView
}
```

---

## 9. packages/svelte/src/nodeView/SvelteNodeView.ts

### 9.1 Abstract 类添加泛型参数（pattern 改动 1）

```ts
// Before
export abstract class AbstractSvelteNodeView
  extends CoreNodeView<SvelteNodeViewComponent>
  implements SvelteRenderer<NodeViewContext>
{

// After
export abstract class AbstractSvelteNodeView<ComponentType>
  extends CoreNodeView<ComponentType>
  implements SvelteRenderer<NodeViewContext>
{
```

### 9.2 具体子类显式传入具体类型 + 多行格式（pattern 改动 2）

```ts
// Before
export class SvelteNodeView extends AbstractSvelteNodeView implements SvelteRenderer<NodeViewContext> {

// After
export class SvelteNodeView
  extends AbstractSvelteNodeView<SvelteNodeViewComponent>
  implements SvelteRenderer<NodeViewContext>
{
```

---

## 10. packages/svelte/src/nodeView/useSvelteNodeViewCreator.ts

### 10.1 import 语句调整（pattern 改动 5）

```ts
// 新增（放在文件最顶部）
import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'

// 删除
import type { SvelteNodeViewUserOptions } from './SvelteNodeViewOptions'
```

### 10.2 函数泛型化 + 构造器签名（pattern 改动 3）

```ts
// Before
export function buildSvelteNodeViewCreator(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
  SvelteNodeViewClass: new (...args: ConstructorParameters<typeof AbstractSvelteNodeView>) => AbstractSvelteNodeView,
  context: Map<any, any>,
) {

// After
export function buildSvelteNodeViewCreator<ComponentType>(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
  SvelteNodeViewClass: new (spec: CoreNodeViewSpec<ComponentType>) => AbstractSvelteNodeView<ComponentType>,
  context: Map<any, any>,
) {
```

### 10.3 参数名 `options` → `userOptions`（pattern 改动 4）

```ts
// Before
return function nodeViewCreator(options: SvelteNodeViewUserOptions): NodeViewConstructor {

// After
return function nodeViewCreator(userOptions: CoreNodeViewUserOptions<ComponentType>): NodeViewConstructor {
```

### 10.4 对象构造从内联改为分步（pattern 改动 6）+ 删除多余空行（pattern 改动 7）

```ts
// Before
return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
  const nodeView = new SvelteNodeViewClass({
    node,
    view,
    getPos,
    decorations,
    innerDecorations,
    options: {
      ...options,
      onUpdate() {
        options.onUpdate?.()
        nodeView.updateContext()
      },
      selectNode() {
        options.selectNode?.()
        nodeView.updateContext()
      },
      deselectNode() {
        options.deselectNode?.()
        nodeView.updateContext()
      },
      destroy() {
        options.destroy?.()
        removeSvelteRenderer(nodeView)
      },
    },
  })
  renderSvelteRenderer(nodeView, { context })

  return nodeView
}

// After
return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
  const patchedUserOptions: CoreNodeViewUserOptions<ComponentType> = {
    ...userOptions,
    onUpdate() {
      userOptions.onUpdate?.()
      nodeView.updateContext()
    },
    selectNode() {
      userOptions.selectNode?.()
      nodeView.updateContext()
    },
    deselectNode() {
      userOptions.deselectNode?.()
      nodeView.updateContext()
    },
    destroy() {
      userOptions.destroy?.()
      removeSvelteRenderer(nodeView)
    },
  }
  const spec: CoreNodeViewSpec<ComponentType> = {
    node,
    view,
    getPos,
    decorations,
    innerDecorations,
    options: patchedUserOptions,
  }
  const nodeView = new SvelteNodeViewClass(spec)
  renderSvelteRenderer(nodeView, { context })
  return nodeView
}
```

---

## 11. packages/solid/src/markView/SolidMarkView.tsx

### 11.1 Abstract 类添加泛型参数（pattern 改动 1）

```ts
// Before
export abstract class AbstractSolidMarkView
  extends CoreMarkView<SolidMarkViewComponent>
  implements SolidRenderer<MarkViewContext>
{

// After
export abstract class AbstractSolidMarkView<ComponentType>
  extends CoreMarkView<ComponentType>
  implements SolidRenderer<MarkViewContext>
{
```

### 11.2 构造函数中的 spec 类型泛型化

Solid 的 Abstract 类有显式 constructor，需要同步泛型化：

```ts
// Before
constructor(spec: CoreMarkViewSpec<SolidMarkViewComponent>) {

// After
constructor(spec: CoreMarkViewSpec<ComponentType>) {
```

### 11.3 具体子类显式传入具体类型 + 多行格式（pattern 改动 2）

```ts
// Before
export class SolidMarkView extends AbstractSolidMarkView implements SolidRenderer<MarkViewContext> {

// After
export class SolidMarkView
  extends AbstractSolidMarkView<SolidMarkViewComponent>
  implements SolidRenderer<MarkViewContext>
{
```

---

## 12. packages/solid/src/markView/useSolidMarkViewCreator.ts

### 12.1 import 语句调整（pattern 改动 5）

```ts
// 新增（放在文件最顶部）
import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'

// 删除
import type { SolidMarkViewUserOptions } from './SolidMarkViewOptions'
```

### 12.2 函数泛型化 + 构造器签名（pattern 改动 3）

```ts
// Before
export function buildSolidMarkViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
  SolidMarkViewClass: new (...args: ConstructorParameters<typeof AbstractSolidMarkView>) => AbstractSolidMarkView,
) {

// After
export function buildSolidMarkViewCreator<ComponentType>(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
  SolidMarkViewClass: new (spec: CoreMarkViewSpec<ComponentType>) => AbstractSolidMarkView<ComponentType>,
) {
```

### 12.3 参数名 `options` → `userOptions`（pattern 改动 4）

```ts
// Before
return function markViewCreator(options: SolidMarkViewUserOptions): MarkViewConstructor {

// After
return function markViewCreator(userOptions: CoreMarkViewUserOptions<ComponentType>): MarkViewConstructor {
```

### 12.4 对象构造从内联改为分步（pattern 改动 6）+ 删除多余空行（pattern 改动 7）

```ts
// Before
return function markViewConstructor(mark, view, inline) {
  const markView = new SolidMarkViewClass({
    mark,
    view,
    inline,
    options: {
      ...options,
      destroy() {
        options.destroy?.()
        removeSolidRenderer(markView)
      },
    },
  })

  renderSolidRenderer(markView, false)

  return markView
}

// After
return function markViewConstructor(mark, view, inline) {
  const patchedUserOptions: CoreMarkViewUserOptions<ComponentType> = {
    ...userOptions,
    destroy() {
      userOptions.destroy?.()
      removeSolidRenderer(markView)
    },
  }
  const spec: CoreMarkViewSpec<ComponentType> = {
    mark,
    view,
    inline,
    options: patchedUserOptions,
  }
  const markView = new SolidMarkViewClass(spec)
  renderSolidRenderer(markView, false)
  return markView
}
```

---

## 13. packages/solid/src/nodeView/SolidNodeView.tsx

### 13.1 Abstract 类添加泛型参数（pattern 改动 1）

```ts
// Before
export abstract class AbstractSolidNodeView
  extends CoreNodeView<SolidNodeViewComponent>
  implements SolidRenderer<NodeViewContext>
{

// After
export abstract class AbstractSolidNodeView<ComponentType>
  extends CoreNodeView<ComponentType>
  implements SolidRenderer<NodeViewContext>
{
```

### 13.2 构造函数中的 spec 类型泛型化

```ts
// Before
constructor(spec: CoreNodeViewSpec<SolidNodeViewComponent>) {

// After
constructor(spec: CoreNodeViewSpec<ComponentType>) {
```

### 13.3 具体子类显式传入具体类型 + 多行格式（pattern 改动 2）

```ts
// Before
export class SolidNodeView extends AbstractSolidNodeView implements SolidRenderer<NodeViewContext> {

// After
export class SolidNodeView
  extends AbstractSolidNodeView<SolidNodeViewComponent>
  implements SolidRenderer<NodeViewContext>
{
```

---

## 14. packages/solid/src/nodeView/useSolidNodeViewCreator.ts

### 14.1 import 语句调整（pattern 改动 5）

```ts
// 新增（放在文件最顶部）
import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'

// 删除
import type { SolidNodeViewUserOptions } from './SolidNodeViewOptions'
```

### 14.2 函数泛型化 + 构造器签名（pattern 改动 3）

```ts
// Before
export function buildSolidNodeViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
  SolidNodeViewClass: new (...args: ConstructorParameters<typeof AbstractSolidNodeView>) => AbstractSolidNodeView,
) {

// After
export function buildSolidNodeViewCreator<ComponentType>(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
  SolidNodeViewClass: new (spec: CoreNodeViewSpec<ComponentType>) => AbstractSolidNodeView<ComponentType>,
) {
```

### 14.3 参数名 `options` → `userOptions`（pattern 改动 4）

```ts
// Before
return function nodeViewCreator(options: SolidNodeViewUserOptions): NodeViewConstructor {

// After
return function nodeViewCreator(userOptions: CoreNodeViewUserOptions<ComponentType>): NodeViewConstructor {
```

### 14.4 对象构造从内联改为分步（pattern 改动 6）+ 删除多余空行（pattern 改动 7）

```ts
// Before
return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
  const nodeView = new SolidNodeViewClass({
    node,
    view,
    getPos,
    decorations,
    innerDecorations,
    options: {
      ...options,
      onUpdate() {
        options.onUpdate?.()
        nodeView.updateContext()
      },
      selectNode() {
        options.selectNode?.()
        nodeView.updateContext()
      },
      deselectNode() {
        options.deselectNode?.()
        nodeView.updateContext()
      },
      destroy() {
        options.destroy?.()
        removeSolidRenderer(nodeView)
      },
    },
  })

  renderSolidRenderer(nodeView, false)

  return nodeView
}

// After
return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
  const patchedUserOptions: CoreNodeViewUserOptions<ComponentType> = {
    ...userOptions,
    onUpdate() {
      userOptions.onUpdate?.()
      nodeView.updateContext()
    },
    selectNode() {
      userOptions.selectNode?.()
      nodeView.updateContext()
    },
    deselectNode() {
      userOptions.deselectNode?.()
      nodeView.updateContext()
    },
    destroy() {
      userOptions.destroy?.()
      removeSolidRenderer(nodeView)
    },
  }
  const spec: CoreNodeViewSpec<ComponentType> = {
    node,
    view,
    getPos,
    decorations,
    innerDecorations,
    options: patchedUserOptions,
  }
  const nodeView = new SolidNodeViewClass(spec)
  renderSolidRenderer(nodeView, false)
  return nodeView
}
```

---

## 15. packages/preact/src/markView/PreactMarkView.ts

### 15.1 Abstract 类添加泛型参数（pattern 改动 1）

```ts
// Before
export abstract class AbstractPreactMarkView
  extends CoreMarkView<PreactMarkViewComponent>
  implements PreactRenderer<MarkViewContext>
{

// After
export abstract class AbstractPreactMarkView<ComponentType>
  extends CoreMarkView<ComponentType>
  implements PreactRenderer<MarkViewContext>
{
```

### 15.2 具体子类显式传入具体类型 + 多行格式（pattern 改动 2）

```ts
// Before
export class PreactMarkView extends AbstractPreactMarkView implements PreactRenderer<MarkViewContext> {

// After
export class PreactMarkView
  extends AbstractPreactMarkView<PreactMarkViewComponent>
  implements PreactRenderer<MarkViewContext>
{
```

---

## 16. packages/preact/src/markView/usePreactMarkViewCreator.ts

### 16.1 import 语句调整（pattern 改动 5）

```ts
// 新增（放在文件最顶部）
import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'

// 删除
import type { PreactMarkViewUserOptions } from './PreactMarkViewOptions'
```

### 16.2 函数泛型化 + 构造器签名（pattern 改动 3）

```ts
// Before
export function buildPreactMarkViewCreator(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
  PreactMarkViewClass: new (...args: ConstructorParameters<typeof AbstractPreactMarkView>) => AbstractPreactMarkView,
) {

// After
export function buildPreactMarkViewCreator<ComponentType>(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
  PreactMarkViewClass: new (spec: CoreMarkViewSpec<ComponentType>) => AbstractPreactMarkView<ComponentType>,
) {
```

### 16.3 参数名 `options` → `userOptions`（pattern 改动 4）

```ts
// Before
return function markViewCreator(options: PreactMarkViewUserOptions): MarkViewConstructor {

// After
return function markViewCreator(userOptions: CoreMarkViewUserOptions<ComponentType>): MarkViewConstructor {
```

### 16.4 对象构造从内联改为分步（pattern 改动 6）+ 删除多余空行（pattern 改动 7）

```ts
// Before
return function markViewConstructor(mark, view, inline) {
  const markView = new PreactMarkViewClass({
    mark,
    view,
    inline,
    options: {
      ...options,
      destroy() {
        options.destroy?.()
        removePreactRenderer(markView)
      },
    },
  })
  renderPreactRenderer(markView, false)

  return markView
}

// After
return function markViewConstructor(mark, view, inline) {
  const patchedUserOptions: CoreMarkViewUserOptions<ComponentType> = {
    ...userOptions,
    destroy() {
      userOptions.destroy?.()
      removePreactRenderer(markView)
    },
  }
  const spec: CoreMarkViewSpec<ComponentType> = {
    mark,
    view,
    inline,
    options: patchedUserOptions,
  }
  const markView = new PreactMarkViewClass(spec)
  renderPreactRenderer(markView, false)
  return markView
}
```

---

## 17. packages/preact/src/nodeView/PreactNodeView.ts

### 17.1 Abstract 类添加泛型参数（pattern 改动 1）

```ts
// Before
export abstract class AbstractPreactNodeView
  extends CoreNodeView<PreactNodeViewComponent>
  implements PreactRenderer<NodeViewContext>
{

// After
export abstract class AbstractPreactNodeView<ComponentType>
  extends CoreNodeView<ComponentType>
  implements PreactRenderer<NodeViewContext>
{
```

### 17.2 具体子类显式传入具体类型 + 多行格式（pattern 改动 2）

```ts
// Before
export class PreactNodeView extends AbstractPreactNodeView implements PreactRenderer<NodeViewContext> {

// After
export class PreactNodeView
  extends AbstractPreactNodeView<PreactNodeViewComponent>
  implements PreactRenderer<NodeViewContext>
{
```

---

## 18. packages/preact/src/nodeView/usePreactNodeViewCreator.ts

### 18.1 import 语句调整（pattern 改动 5）

```ts
// 新增（放在文件最顶部）
import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'

// 删除
import type { PreactNodeViewUserOptions } from './PreactNodeViewOptions'
```

### 18.2 函数泛型化 + 构造器签名（pattern 改动 3）

```ts
// Before
export function buildPreactNodeViewCreator(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
  PreactNodeViewClass: new (...args: ConstructorParameters<typeof AbstractPreactNodeView>) => AbstractPreactNodeView,
) {

// After
export function buildPreactNodeViewCreator<ComponentType>(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
  PreactNodeViewClass: new (spec: CoreNodeViewSpec<ComponentType>) => AbstractPreactNodeView<ComponentType>,
) {
```

### 18.3 参数名 `options` → `userOptions`（pattern 改动 4）

```ts
// Before
return function nodeViewCreator(options: PreactNodeViewUserOptions): NodeViewConstructor {

// After
return function nodeViewCreator(userOptions: CoreNodeViewUserOptions<ComponentType>): NodeViewConstructor {
```

### 18.4 对象构造从内联改为分步（pattern 改动 6）+ 删除多余空行（pattern 改动 7）

```ts
// Before
return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
  const nodeView = new PreactNodeViewClass({
    node,
    view,
    getPos,
    decorations,
    innerDecorations,
    options: {
      ...options,
      onUpdate() {
        options.onUpdate?.()
        renderPreactRenderer(nodeView)
      },
      selectNode() {
        options.selectNode?.()
        renderPreactRenderer(nodeView)
      },
      deselectNode() {
        options.deselectNode?.()
        renderPreactRenderer(nodeView)
      },
      destroy() {
        options.destroy?.()
        removePreactRenderer(nodeView)
      },
    },
  })

  renderPreactRenderer(nodeView, false)

  return nodeView
}

// After
return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
  const patchedUserOptions: CoreNodeViewUserOptions<ComponentType> = {
    ...userOptions,
    onUpdate() {
      userOptions.onUpdate?.()
      renderPreactRenderer(nodeView)
    },
    selectNode() {
      userOptions.selectNode?.()
      renderPreactRenderer(nodeView)
    },
    deselectNode() {
      userOptions.deselectNode?.()
      renderPreactRenderer(nodeView)
    },
    destroy() {
      userOptions.destroy?.()
      removePreactRenderer(nodeView)
    },
  }
  const spec: CoreNodeViewSpec<ComponentType> = {
    node,
    view,
    getPos,
    decorations,
    innerDecorations,
    options: patchedUserOptions,
  }
  const nodeView = new PreactNodeViewClass(spec)
  renderPreactRenderer(nodeView, false)
  return nodeView
}
```

---

## 总览

| # | 文件 | 改动类型 |
|---|------|---------|
| 1 | `packages/react/src/nodeView/ReactNodeView.ts` | 改动 1, 2 |
| 2 | `packages/react/src/nodeView/useReactNodeViewCreator.ts` | 改动 3, 4, 5, 6, 7 |
| 3 | `packages/vue/src/markView/VueMarkView.ts` | 改动 1, 2 |
| 4 | `packages/vue/src/markView/useVueMarkViewCreator.ts` | 改动 3, 4, 5, 6, 7 |
| 5 | `packages/vue/src/nodeView/VueNodeView.ts` | 改动 1, 2 |
| 6 | `packages/vue/src/nodeView/useVueNodeViewCreator.ts` | 改动 3, 4, 5, 6, 7 |
| 7 | `packages/svelte/src/markView/SvelteMarkView.ts` | 改动 1, 2 |
| 8 | `packages/svelte/src/markView/useSvelteMarkViewCreator.ts` | 改动 3, 4, 5, 6, 7 |
| 9 | `packages/svelte/src/nodeView/SvelteNodeView.ts` | 改动 1, 2 |
| 10 | `packages/svelte/src/nodeView/useSvelteNodeViewCreator.ts` | 改动 3, 4, 5, 6, 7 |
| 11 | `packages/solid/src/markView/SolidMarkView.tsx` | 改动 1, 2 + constructor 泛型化 |
| 12 | `packages/solid/src/markView/useSolidMarkViewCreator.ts` | 改动 3, 4, 5, 6, 7 |
| 13 | `packages/solid/src/nodeView/SolidNodeView.tsx` | 改动 1, 2 + constructor 泛型化 |
| 14 | `packages/solid/src/nodeView/useSolidNodeViewCreator.ts` | 改动 3, 4, 5, 6, 7 |
| 15 | `packages/preact/src/markView/PreactMarkView.ts` | 改动 1, 2 |
| 16 | `packages/preact/src/markView/usePreactMarkViewCreator.ts` | 改动 3, 4, 5, 6, 7 |
| 17 | `packages/preact/src/nodeView/PreactNodeView.ts` | 改动 1, 2 |
| 18 | `packages/preact/src/nodeView/usePreactNodeViewCreator.ts` | 改动 3, 4, 5, 6, 7 |

共 18 个文件，涉及 5 个包（react, vue, svelte, solid, preact），每个包 2 个 view 类型（markView, nodeView）。

### 特殊注意事项

- **Svelte**：`buildSvelteXxxViewCreator` 有额外的 `context: Map<any, any>` 参数，迁移时保留不动。
- **Solid**：`AbstractSolidXxxView` 有显式的 `constructor(spec: CoreXxxViewSpec<具体类型>)`，需要将 spec 参数类型中的具体类型替换为 `ComponentType`。
- **Vue / Svelte**：nodeView creator 中 patch 的回调调用 `nodeView.updateContext()` 而非 `renderXxxRenderer(nodeView)`，迁移时保留各自的原有逻辑不变。
- **已跳过的包**：`lit` 包不使用 Abstract 类 + Creator 的模式，无需迁移。

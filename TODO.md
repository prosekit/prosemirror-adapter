# TODO: useAbstractXxxYyyViewCreator → buildXxxYyyViewCreator 重构

按照 commit `ed99c8c` 的 pattern，将所有 `useAbstractXxxYyyViewCreator` 重构为纯函数 `buildXxxYyyViewCreator`。

## 已完成

- [x] `useAbstractReactNodeViewCreator` → `buildReactNodeViewCreator` (ed99c8c)

## React

- [x] `useAbstractReactMarkViewCreator` → `buildReactMarkViewCreator`
  - 文件: `packages/react/src/markView/useReactMarkViewCreator.ts`
  - 移除内部 `useCallback`，改为纯函数
  - 调用方 `useReactMarkViewCreator` 用 `useMemo` 包裹
  - `import { useCallback }` → `import { useMemo }`
  - 更新 export: `packages/react/src/markView/index.ts`, `packages/react/src/index.ts`

## Preact

- [x] `useAbstractPreactNodeViewCreator` → `buildPreactNodeViewCreator`
  - 文件: `packages/preact/src/nodeView/usePreactNodeViewCreator.ts`
  - 移除内部 `useCallback`，改为纯函数
  - 调用方 `usePreactNodeViewCreator` 用 `useMemo` 包裹
  - `import { useCallback }` → `import { useMemo }`
  - 更新 export: `packages/preact/src/nodeView/index.ts`, `packages/preact/src/index.ts`

- [x] `useAbstractPreactMarkViewCreator` → `buildPreactMarkViewCreator`
  - 文件: `packages/preact/src/markView/usePreactMarkViewCreator.ts`
  - 移除内部 `useCallback`，改为纯函数
  - 调用方 `usePreactMarkViewCreator` 用 `useMemo` 包裹
  - `import { useCallback }` → `import { useMemo }`
  - 更新 export: `packages/preact/src/markView/index.ts`, `packages/preact/src/index.ts`

## Vue

- [x] `useAbstractVueNodeViewCreator` → `buildVueNodeViewCreator`
  - 文件: `packages/vue/src/nodeView/useVueNodeViewCreator.ts`
  - 重命名函数
  - 更新 export: `packages/vue/src/nodeView/index.ts`, `packages/vue/src/index.ts`

- [ ] `buildVueNodeViewCreator`: 箭头函数 → 具名函数
  - 文件: `packages/vue/src/nodeView/useVueNodeViewCreator.ts`
  - `const createVueNodeView: NodeViewFactory = (options) => (node, ...) => {` → `return function nodeViewCreator(options) { return function nodeViewConstructor(node, ...) {`

- [x] `useAbstractVueMarkViewCreator` → `buildVueMarkViewCreator`
  - 文件: `packages/vue/src/markView/useVueMarkViewCreator.ts`
  - 重命名函数
  - 更新 export: `packages/vue/src/markView/index.ts`, `packages/vue/src/index.ts`

- [ ] `buildVueMarkViewCreator`: 箭头函数 → 具名函数
  - 文件: `packages/vue/src/markView/useVueMarkViewCreator.ts`
  - `const createVueMarkView: MarkViewFactory = (options) => (mark, ...) => {` → `return function markViewCreator(options) { return function markViewConstructor(mark, ...) {`

## Solid

- [x] `useAbstractSolidNodeViewCreator` → `buildSolidNodeViewCreator`
  - 文件: `packages/solid/src/nodeView/useSolidNodeViewCreator.ts`
  - 重命名函数
  - 更新 export: `packages/solid/src/nodeView/index.ts`, `packages/solid/src/index.ts`

- [ ] `buildSolidNodeViewCreator`: 箭头函数 → 具名函数
  - 文件: `packages/solid/src/nodeView/useSolidNodeViewCreator.ts`
  - `const createSolidNodeView = (options): NodeViewConstructor => (node, ...) => {` → `return function nodeViewCreator(options) { return function nodeViewConstructor(node, ...) {`

- [x] `useAbstractSolidMarkViewCreator` → `buildSolidMarkViewCreator`
  - 文件: `packages/solid/src/markView/useSolidMarkViewCreator.ts`
  - 重命名函数
  - 更新 export: `packages/solid/src/markView/index.ts`, `packages/solid/src/index.ts`

- [ ] `buildSolidMarkViewCreator`: 箭头函数 → 具名函数
  - 文件: `packages/solid/src/markView/useSolidMarkViewCreator.ts`
  - `const createSolidMarkView = (options): MarkViewConstructor => (mark, ...) => {` → `return function markViewCreator(options) { return function markViewConstructor(mark, ...) {`

## Svelte

- [x] `useAbstractSvelteNodeViewCreator` → `buildSvelteNodeViewCreator`
  - 文件: `packages/svelte/src/nodeView/useSvelteNodeViewCreator.ts`
  - 重命名函数，`getAllContexts()` 移到调用方
  - 更新 export: `packages/svelte/src/nodeView/index.ts`, `packages/svelte/src/index.ts`

- [ ] `buildSvelteNodeViewCreator`: 箭头函数 → 具名函数
  - 文件: `packages/svelte/src/nodeView/useSvelteNodeViewCreator.ts`
  - `const createSvelteNodeView: NodeViewFactory = (options) => (node, ...) => {` → `return function nodeViewCreator(options) { return function nodeViewConstructor(node, ...) {`

- [x] `useAbstractSvelteMarkViewCreator` → `buildSvelteMarkViewCreator`
  - 文件: `packages/svelte/src/markView/useSvelteMarkViewCreator.ts`
  - 重命名函数，`getAllContexts()` 移到调用方
  - 更新 export: `packages/svelte/src/markView/index.ts`, `packages/svelte/src/index.ts`

- [ ] `buildSvelteMarkViewCreator`: 箭头函数 → 具名函数
  - 文件: `packages/svelte/src/markView/useSvelteMarkViewCreator.ts`
  - `const createSvelteMarkView: MarkViewFactory = (options) => (mark, ...) => {` → `return function markViewCreator(options) { return function markViewConstructor(mark, ...) {`

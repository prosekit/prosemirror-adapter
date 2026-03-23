# TODO: useAbstractXxxYyyViewCreator → buildXxxYyyViewCreator 重构

按照 commit `ed99c8c` 的 pattern，将所有 `useAbstractXxxYyyViewCreator` 重构为纯函数 `buildXxxYyyViewCreator`。

## 已完成

- [x] `useAbstractReactNodeViewCreator` → `buildReactNodeViewCreator` (ed99c8c)

## React

- [ ] `useAbstractReactMarkViewCreator` → `buildReactMarkViewCreator`
  - 文件: `packages/react/src/markView/useReactMarkViewCreator.ts`
  - 移除内部 `useCallback`，改为纯函数
  - 调用方 `useReactMarkViewCreator` 用 `useMemo` 包裹
  - `import { useCallback }` → `import { useMemo }`
  - 更新 export: `packages/react/src/markView/index.ts`, `packages/react/src/index.ts`

## Preact

- [ ] `useAbstractPreactNodeViewCreator` → `buildPreactNodeViewCreator`
  - 文件: `packages/preact/src/nodeView/usePreactNodeViewCreator.ts`
  - 移除内部 `useCallback`，改为纯函数
  - 调用方 `usePreactNodeViewCreator` 用 `useMemo` 包裹
  - `import { useCallback }` → `import { useMemo }`
  - 更新 export: `packages/preact/src/nodeView/index.ts`, `packages/preact/src/index.ts`

- [ ] `useAbstractPreactMarkViewCreator` → `buildPreactMarkViewCreator`
  - 文件: `packages/preact/src/markView/usePreactMarkViewCreator.ts`
  - 移除内部 `useCallback`，改为纯函数
  - 调用方 `usePreactMarkViewCreator` 用 `useMemo` 包裹
  - `import { useCallback }` → `import { useMemo }`
  - 更新 export: `packages/preact/src/markView/index.ts`, `packages/preact/src/index.ts`

## Vue

- [ ] `useAbstractVueNodeViewCreator` → `buildVueNodeViewCreator`
  - 文件: `packages/vue/src/nodeView/useVueNodeViewCreator.ts`
  - 已经是纯函数（无 hook），仅需重命名
  - 更新 export: `packages/vue/src/nodeView/index.ts`, `packages/vue/src/index.ts`

- [ ] `useAbstractVueMarkViewCreator` → `buildVueMarkViewCreator`
  - 文件: `packages/vue/src/markView/useVueMarkViewCreator.ts`
  - 已经是纯函数（无 hook），仅需重命名
  - 更新 export: `packages/vue/src/markView/index.ts`, `packages/vue/src/index.ts`

## Solid

- [ ] `useAbstractSolidNodeViewCreator` → `buildSolidNodeViewCreator`
  - 文件: `packages/solid/src/nodeView/useSolidNodeViewCreator.ts`
  - 已经是纯函数（无 hook），仅需重命名
  - 更新 export: `packages/solid/src/nodeView/index.ts`, `packages/solid/src/index.ts`

- [ ] `useAbstractSolidMarkViewCreator` → `buildSolidMarkViewCreator`
  - 文件: `packages/solid/src/markView/useSolidMarkViewCreator.ts`
  - 已经是纯函数（无 hook），仅需重命名
  - 更新 export: `packages/solid/src/markView/index.ts`, `packages/solid/src/index.ts`

## Svelte

- [ ] `useAbstractSvelteNodeViewCreator` → `buildSvelteNodeViewCreator`
  - 文件: `packages/svelte/src/nodeView/useSvelteNodeViewCreator.ts`
  - 注意: 内部调用了 `getAllContexts()`，需将此调用移到调用方 `useSvelteNodeViewCreator` 中，并作为参数传入 `buildSvelteNodeViewCreator`
  - 更新 export: `packages/svelte/src/nodeView/index.ts`, `packages/svelte/src/index.ts`

- [ ] `useAbstractSvelteMarkViewCreator` → `buildSvelteMarkViewCreator`
  - 文件: `packages/svelte/src/markView/useSvelteMarkViewCreator.ts`
  - 注意: 内部调用了 `getAllContexts()`，需将此调用移到调用方 `useSvelteMarkViewCreator` 中，并作为参数传入 `buildSvelteMarkViewCreator`
  - 更新 export: `packages/svelte/src/markView/index.ts`, `packages/svelte/src/index.ts`

# Commit ed99c8c 变动 Pattern 分析

## 变动概要

将 `useAbstractReactNodeViewCreator` 重命名为 `buildReactNodeViewCreator`，并从 React Hook 重构为纯函数。

## Pattern：Hook → Pure Function + 调用方 Memoize

### 重构前

- `useAbstractReactNodeViewCreator` 是一个 React Hook，内部使用 `useCallback` 做 memoization
- 调用方 `useReactNodeViewCreator` 直接调用它，依赖其内部的 `useCallback`

### 重构后

- `buildReactNodeViewCreator` 是一个纯函数（不含任何 React Hook），返回普通函数
- 内部的 `useCallback` 被移除，闭包中嵌套的箭头函数被改写为具名 function（`nodeViewCreator` 和 `nodeViewConstructor`）
- 调用方 `useReactNodeViewCreator` 用 `useMemo` 包裹对 `buildReactNodeViewCreator` 的调用，将 memoization 职责上移到调用方

### 涉及文件

1. `packages/react/src/nodeView/useReactNodeViewCreator.ts` — 核心逻辑变动
2. `packages/react/src/nodeView/index.ts` — 更新 export 名称
3. `packages/react/src/index.ts` — 更新 re-export 名称

### 要点

- 命名从 `useXxx`（Hook 约定）改为 `buildXxx`（纯函数/工厂函数约定）
- `useCallback` 依赖项 `[removeReactRenderer, renderReactRenderer, ReactNodeViewClass]` 被移除，因为纯函数不需要声明依赖
- 调用方的 `useMemo` 依赖项为 `[renderReactRenderer, removeReactRenderer]`，去掉了 `ReactNodeViewClass`（因为它在调用方是硬编码常量 `ReactNodeView`）
- `import { useCallback } from 'react'` 替换为 `import { useMemo } from 'react'`

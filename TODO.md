# Preact Support Implementation Plan

## Overview

Add Preact support to prosemirror-adapter, following the existing patterns established for React, Vue, Svelte, Solid, and Lit adapters. The Preact implementation will closely mirror the React adapter due to their similar APIs.

## Implementation Steps

### Step 1: Create Preact Adapter Package Structure ✅

- [x] Create `/packages/preact/` directory
- [x] Set up package.json with proper dependencies
- [x] Configure TypeScript (tsconfig.json)
- [x] Create source file structure matching React adapter

### Step 2: Implement Core Preact Renderer ✅

- [x] Create `PreactRenderer.ts` - Handle Preact component rendering lifecycle
- [x] Implement portal management for rendering components outside the main tree
- [x] Set up proper context update mechanisms

### Step 3: Implement Node View Support ✅

- [x] Create `nodeView/` directory structure
- [x] Implement `PreactNodeView.tsx` - Core node view class
- [x] Create `nodeViewContext.tsx` - Context for node views
- [x] Implement `PreactNodeViewOptions.ts` - Configuration types
- [x] Add `usePreactNodeViewCreator.tsx` hook

### Step 4: Implement Mark View Support ✅

- [x] Create `markView/` directory structure
- [x] Implement `PreactMarkView.tsx` - Core mark view class
- [x] Create `markViewContext.tsx` - Context for mark views
- [x] Implement `PreactMarkViewOptions.ts` - Configuration types
- [x] Add `usePreactMarkViewCreator.tsx` hook

### Step 5: Implement Plugin View Support ✅

- [x] Create `pluginView/` directory structure
- [x] Implement `PreactPluginView.tsx` - Core plugin view class
- [x] Create `pluginViewContext.tsx` - Context for plugin views
- [x] Implement `PreactPluginViewOptions.ts` - Configuration types
- [x] Add `usePreactPluginViewCreator.tsx` hook

### Step 6: Implement Widget View Support ✅

- [x] Create `widgetView/` directory structure
- [x] Implement `PreactWidgetView.tsx` - Core widget view class
- [x] Create `widgetViewContext.tsx` - Context for widget views
- [x] Implement `PreactWidgetViewOptions.ts` - Configuration types
- [x] Add `usePreactWidgetViewCreator.tsx` hook

### Step 7: Create Provider Component ✅

- [x] Implement `Provider.tsx` - Main context provider
- [x] Set up all context providers (node, mark, plugin, widget)
- [x] Configure portal rendering system
- [x] Export public API in `index.ts`

### Step 8: Add Preact Examples ✅

- [x] Create `/examples/preact/` directory
- [x] Set up Vite configuration
- [x] Create basic editor example with all view types
- [x] Add components demonstrating each feature:
  - [x] Heading node view
  - [x] Paragraph node view
  - [x] Hash widget view
  - [x] Size plugin view
- [x] Style components to match existing examples

### Step 9: Add E2E Tests for Preact

- [ ] Create `/e2e/src/preact/` directory
- [ ] Set up test components matching other frameworks
- [ ] Create test pages for Astro integration
- [ ] Update playwright tests to include Preact
- [ ] Ensure all test scenarios pass:
  - [ ] Node view rendering and updates
  - [ ] Mark view rendering
  - [ ] Plugin view lifecycle
  - [ ] Widget decoration rendering

### Step 10: Update Documentation and Configuration

- [ ] Update main README.md to include Preact
- [ ] Add Preact logo to assets
- [ ] Update root package.json workspace configuration
- [ ] Update CI/CD configuration if needed
- [ ] Add Preact to the documentation table

### Step 11: Final Testing and Validation

- [ ] Run full build: `pnpm run build`
- [ ] Run linting: `pnpm run lint`
- [ ] Run type checking: `pnpm run typecheck`
- [ ] Run formatting: `pnpm run fix`
- [ ] Test examples manually
- [ ] Ensure CI passes on PR

## Technical Considerations

### Key Differences from React

- Use Preact's `h` function instead of React.createElement
- Use `preact/compat` for React compatibility where needed
- Adjust for Preact's smaller API surface (no Synthetic Events)
- Consider bundle size optimizations specific to Preact

### API Compatibility

- Maintain API parity with React adapter where possible
- Use same hook names with "Preact" prefix
- Follow same context provider pattern
- Export same public interfaces

### Testing Strategy

- Mirror React test structure
- Test Preact-specific optimizations
- Verify compatibility with all ProseMirror features
- Ensure no performance regressions

## Progress Tracking

Each step will be marked as complete after successful implementation and testing. After each step, the code will be committed, pushed, and CI will be checked.

---

_Last Updated: [Will be updated as progress is made]_

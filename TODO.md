# Preact Support Implementation Plan

## Overview
Add Preact support to prosemirror-adapter, following the existing patterns established for React, Vue, Svelte, Solid, and Lit adapters. The Preact implementation will closely mirror the React adapter due to their similar APIs.

## Implementation Steps

### Step 1: Create Preact Adapter Package Structure 
- [x] Create `/packages/preact/` directory
- [x] Set up package.json with proper dependencies
- [x] Configure TypeScript (tsconfig.json)
- [x] Create source file structure matching React adapter

### Step 2: Implement Core Preact Renderer
- [ ] Create `PreactRenderer.ts` - Handle Preact component rendering lifecycle
- [ ] Implement portal management for rendering components outside the main tree
- [ ] Set up proper context update mechanisms

### Step 3: Implement Node View Support
- [ ] Create `nodeView/` directory structure
- [ ] Implement `PreactNodeView.tsx` - Core node view class
- [ ] Create `nodeViewContext.tsx` - Context for node views
- [ ] Implement `PreactNodeViewOptions.ts` - Configuration types
- [ ] Add `usePreactNodeViewCreator.tsx` hook

### Step 4: Implement Mark View Support
- [ ] Create `markView/` directory structure
- [ ] Implement `PreactMarkView.tsx` - Core mark view class
- [ ] Create `markViewContext.tsx` - Context for mark views
- [ ] Implement `PreactMarkViewOptions.ts` - Configuration types
- [ ] Add `usePreactMarkViewCreator.tsx` hook

### Step 5: Implement Plugin View Support
- [ ] Create `pluginView/` directory structure
- [ ] Implement `PreactPluginView.tsx` - Core plugin view class
- [ ] Create `pluginViewContext.tsx` - Context for plugin views
- [ ] Implement `PreactPluginViewOptions.ts` - Configuration types
- [ ] Add `usePreactPluginViewCreator.tsx` hook

### Step 6: Implement Widget View Support
- [ ] Create `widgetView/` directory structure
- [ ] Implement `PreactWidgetView.tsx` - Core widget view class
- [ ] Create `widgetViewContext.tsx` - Context for widget views
- [ ] Implement `PreactWidgetViewOptions.ts` - Configuration types
- [ ] Add `usePreactWidgetViewCreator.tsx` hook

### Step 7: Create Provider Component
- [ ] Implement `Provider.tsx` - Main context provider
- [ ] Set up all context providers (node, mark, plugin, widget)
- [ ] Configure portal rendering system
- [ ] Export public API in `index.ts`

### Step 8: Add Preact Examples
- [ ] Create `/examples/preact/` directory
- [ ] Set up Vite configuration
- [ ] Create basic editor example with all view types
- [ ] Add components demonstrating each feature:
  - [ ] Heading node view
  - [ ] Paragraph node view
  - [ ] Bold mark view
  - [ ] Menu plugin view
  - [ ] Emoji widget view
- [ ] Style components to match existing examples

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
*Last Updated: [Will be updated as progress is made]*
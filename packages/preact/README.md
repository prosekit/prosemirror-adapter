# @prosemirror-adapter/preact

Preact adapter for [ProseMirror](https://prosemirror.net/).

## Installation

```bash
npm install @prosemirror-adapter/preact
```

## Usage

### Basic Usage

```tsx
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/preact'

export function Editor() {
  return <ProsemirrorAdapterProvider>{/* Your ProseMirror editor component */}</ProsemirrorAdapterProvider>
}
```

### Node View

```tsx
import { useNodeViewFactory } from '@prosemirror-adapter/preact'

const Paragraph = () => {
  return <div>This is a paragraph node view</div>
}

export function Editor() {
  const nodeViewFactory = useNodeViewFactory()

  const paragraphNodeView = nodeViewFactory({
    component: Paragraph,
    as: 'div',
    contentAs: 'p',
  })

  // Use paragraphNodeView in your ProseMirror schema
}
```

### Plugin View

```tsx
import { usePluginViewFactory } from '@prosemirror-adapter/preact'

const PluginComponent = () => {
  return <div>Plugin view content</div>
}

export function Editor() {
  const pluginViewFactory = usePluginViewFactory()

  const pluginView = pluginViewFactory({
    component: PluginComponent,
    root: document.body, // or any DOM element
  })

  // Use pluginView in your ProseMirror plugin
}
```

## API

This package provides the same API as `@prosemirror-adapter/react` but adapted for Preact:

- `ProsemirrorAdapterProvider` - Context provider component
- `useNodeViewFactory` - Hook to create node views
- `useMarkViewFactory` - Hook to create mark views
- `usePluginViewFactory` - Hook to create plugin views
- `useWidgetViewFactory` - Hook to create widget views
- Context hooks for accessing view data in components

## License

MIT

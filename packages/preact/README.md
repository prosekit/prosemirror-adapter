# @prosemirror-adapter/preact

[Preact](https://preactjs.com/) adapter for [ProseMirror](https://prosemirror.net/).

## Example

You can view the example in [prosemirror-adapter/examples/preact](../../examples/preact/).

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Saul-Mirone/prosemirror-adapter/tree/main/examples/preact)

## Getting Started

### Install the package

```bash
npm install @prosemirror-adapter/preact
```

### Wrap your component with the provider

```tsx
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/preact'
import { StrictMode } from 'preact/compat'
import { render } from 'preact'

import { YourAwesomeEditor } from './YourAwesomeEditor'

const root = document.querySelector('#app')

if (!root) throw new Error('Missing #app element')

render(
  <StrictMode>
    <ProsemirrorAdapterProvider>
      <YourAwesomeEditor />
    </ProsemirrorAdapterProvider>
  </StrictMode>,
  root,
)
```

## Building Node Views

```tsx
import { useNodeViewContext } from '@prosemirror-adapter/preact'

export function Paragraph() {
  const { contentRef, selected } = useNodeViewContext()

  return <div ref={contentRef} style={{ outline: selected ? '2px solid #3b82f6' : 'none' }} />
}
```

Bind the component with ProseMirror:

```tsx
import { useNodeViewFactory } from '@prosemirror-adapter/preact'
import { useCallback } from 'preact/hooks'
import { EditorView } from 'prosemirror-view'

import { Paragraph } from './Paragraph'

export function YourAwesomeEditor() {
  const nodeViewFactory = useNodeViewFactory()

  const editorRef = useCallback((element: HTMLDivElement | null) => {
    if (!element || element.firstChild) return

    new EditorView(element, {
      state: YourProsemirrorEditorState,
      nodeViews: {
        paragraph: nodeViewFactory({
          component: Paragraph,
          as: 'div',
          contentAs: 'p',
        }),
      },
    })
  }, [])

  return <div ref={editorRef} />
}
```

## Mark, Plugin, and Widget Views

The same hooks available in the React package are exposed for Preact:

- `useMarkViewFactory`
- `usePluginViewFactory`
- `useWidgetViewFactory`
- `useMarkViewContext`
- `usePluginViewContext`
- `useWidgetViewContext`

Each hook mirrors the behaviour of its React counterpart, providing idiomatic Preact components that stay in sync with the underlying ProseMirror view.

## API Surface

```ts
export { ProsemirrorAdapterProvider } from '@prosemirror-adapter/preact'
export { useNodeViewFactory, useNodeViewContext, createNodeViewContext } from '@prosemirror-adapter/preact/nodeView'
export { useMarkViewFactory, useMarkViewContext, createMarkViewContext } from '@prosemirror-adapter/preact/markView'
export {
  usePluginViewFactory,
  usePluginViewContext,
  createPluginViewContext,
} from '@prosemirror-adapter/preact/pluginView'
export {
  useWidgetViewFactory,
  useWidgetViewContext,
  createWidgetViewContext,
} from '@prosemirror-adapter/preact/widgetView'
```

Refer to the React adapter documentation for a deeper dive—only the UI layer changes.

## Contributing

Follow our [contribution guide](../../CONTRIBUTING.md) to learn how to contribute to prosemirror-adapter.

## License

[MIT](../../LICENSE)

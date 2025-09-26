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

### Wrap your component with provider

```tsx
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/preact'
import { YourAwesomeEditor } from 'somewhere'

export function Component() {
  return (
    <ProsemirrorAdapterProvider>
      <YourAwesomeEditor />
    </ProsemirrorAdapterProvider>
  )
}
```

<details>

<summary>

### Play with node view

</summary>

In this section we will implement a node view for paragraph node.

#### Build component for [node view](https://prosemirror.net/docs/ref/#view.NodeView)

```tsx
import { useNodeViewContext } from '@prosemirror-adapter/preact'

function Paragraph() {
  const { contentRef, selected } = useNodeViewContext()
  return <div style={{ outline: selected ? 'blue solid 1px' : 'none' }} role="presentation" ref={contentRef} />
}
```

#### Bind node view components with prosemirror

```tsx
import { useNodeViewFactory } from '@prosemirror-adapter/preact'
import type { FunctionalComponent } from 'preact'
import { useCallback, useRef } from 'preact/hooks'

import { Paragraph } from './Paragraph'

export const YourAwesomeEditor: FunctionalComponent = () => {
  const nodeViewFactory = useNodeViewFactory()

  const editorRef = useCallback(
    (element: HTMLDivElement) => {
      if (!element || element.firstChild) return

      const editorView = new EditorView(element, {
        state: YourProsemirrorEditorState,
        nodeViews: {
          paragraph: nodeViewFactory({
            component: Paragraph,
            // Optional: add some options
            as: 'div',
            contentAs: 'p',
          }),
        },
      })
    },
    [nodeViewFactory],
  )

  return <div className="editor" ref={editorRef} />
}
```

🚀 Congratulations! You have built your first preact node view with prosemirror-adapter.

</details>

<details>

<summary>

### Play with mark view

</summary>

In this section we will implement a mark view for links that changes color periodically.

#### Build component for mark view

```tsx
import { useEffect, useState } from 'preact/hooks'
import { useMarkViewContext } from '@prosemirror-adapter/preact'

const colors = [
  '#f06292',
  '#ba68c8',
  '#9575cd',
  '#7986cb',
  '#64b5f6',
  '#4fc3f7',
  '#4dd0e1',
  '#4db6ac',
  '#81c784',
  '#aed581',
  '#ffb74d',
  '#ffa726',
  '#ff8a65',
  '#d4e157',
  '#ffd54f',
  '#ffecb3',
]

function pickRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}

export function Link() {
  const [color, setColor] = useState(colors[0])
  const { mark, contentRef } = useMarkViewContext()
  const href = mark.attrs.href as string
  const title = mark.attrs.title as string | null

  useEffect(() => {
    const interval = setInterval(() => {
      setColor(pickRandomColor())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <a
      href={href}
      ref={contentRef}
      style={{ color, transition: 'color 1s ease-in-out' }}
      title={title || undefined}
    ></a>
  )
}
```

#### Bind mark view components with prosemirror

```tsx
import { useMarkViewFactory } from '@prosemirror-adapter/preact'
import type { FunctionalComponent } from 'preact'
import { useCallback } from 'preact/hooks'

export const YourAwesomeEditor: FunctionalComponent = () => {
  const markViewFactory = useMarkViewFactory()

  const editorRef = useCallback(
    (element: HTMLDivElement) => {
      if (!element || element.firstChild) return

      const editorView = new EditorView(element, {
        state: EditorState.create({
          schema: YourProsemirrorSchema,
          plugins: [
            new Plugin({
              props: {
                markViews: {
                  link: markViewFactory({
                    component: Link,
                  }),
                },
              },
            }),
          ],
        }),
      })
    },
    [markViewFactory],
  )

  return <div className="editor" ref={editorRef} />
}
```

🚀 Congratulations! You have built your first preact mark view with prosemirror-adapter.

</details>

<details>

<summary>

### Play with plugin view

</summary>

In this section we will implement a plugin view that will display the size of the document.

#### Build component for [plugin view](https://prosemirror.net/docs/ref/#state.PluginView)

```tsx
import { usePluginViewContext } from '@prosemirror-adapter/preact'

function Size() {
  const { view } = usePluginViewContext()
  const size = view.state.doc.nodeSize
  return <div>Size for document: {size}</div>
}
```

#### Bind plugin view components with prosemirror

```tsx
import { usePluginViewFactory } from '@prosemirror-adapter/preact'
import type { FunctionalComponent } from 'preact'
import { useCallback, useRef } from 'preact/hooks'
import { Plugin } from 'prosemirror-state'

import { Paragraph } from './Paragraph'

export const YourAwesomeEditor: FunctionalComponent = () => {
  const pluginViewFactory = usePluginViewFactory()

  const editorRef = useCallback(
    (element: HTMLDivElement) => {
      if (!element || element.firstChild) return

      const editorView = new EditorView(element, {
        state: EditorState.create({
          schema: YourProsemirrorSchema,
          plugins: [
            new Plugin({
              view: pluginViewFactory({
                component: Size,
              }),
            }),
          ],
        }),
      })
    },
    [pluginViewFactory],
  )

  return <div className="editor" ref={editorRef} />
}
```

🚀 Congratulations! You have built your first preact plugin view with prosemirror-adapter.

</details>

<details>

<summary>

### Play with widget view

</summary>

In this section we will implement a widget view that will add hashes for heading when selected.

#### Build component for [widget decoration view](https://prosemirror.net/docs/ref/#view.Decoration%5Ewidget)

```tsx
import { useWidgetViewContext } from '@prosemirror-adapter/preact'

export function Hashes() {
  const { spec } = useWidgetViewContext()
  const level = spec?.level
  const hashes = Array(level || 0)
    .fill('#')
    .join('')

  return <span style={{ color: 'blue', marginRight: 6 }}>{hashes}</span>
}
```

#### Bind widget view components with prosemirror

```tsx
import { useWidgetViewFactory } from '@prosemirror-adapter/preact'
import type { FunctionalComponent } from 'preact'
import { useCallback, useRef } from 'preact/hooks'
import { Plugin } from 'prosemirror-state'

import { Hashes } from './Hashes'

export const YourAwesomeEditor: FunctionalComponent = () => {
  const widgetViewFactory = useWidgetViewFactory()

  const editorRef = useCallback(
    (element: HTMLDivElement) => {
      if (!element || element.firstChild) return

      const getHashWidget = widgetViewFactory({
        as: 'i',
        component: Hashes,
      })

      const editorView = new EditorView(element, {
        state: EditorState.create({
          schema: YourProsemirrorSchema,
          plugins: [
            new Plugin({
              props: {
                decorations(state) {
                  const { $from } = state.selection
                  const node = $from.node()
                  if (node.type.name !== 'heading') return DecorationSet.empty

                  const widget = getHashWidget($from.before() + 1, {
                    side: -1,
                    level: node.attrs.level,
                  })

                  return DecorationSet.create(state.doc, [widget])
                },
              },
            }),
          ],
        }),
      })
    },
    [widgetViewFactory],
  )

  return <div className="editor" ref={editorRef} />
}
```

🚀 Congratulations! You have built your first preact widget view with prosemirror-adapter.

</details>

## API

<details>

<summary>

### Node view API

</summary>

#### useNodeViewFactory: () => (options: NodeViewFactoryOptions) => NodeView

```ts
type DOMSpec = string | HTMLElement | ((node: Node) => HTMLElement)

interface NodeViewFactoryOptions {
  // Component
  component: PreactComponent

  // The DOM element to use as the root node of the node view.
  as?: DOMSpec
  // The DOM element that contains the content of the node.
  contentAs?: DOMSpec

  // Overrides: this part is equal to properties of [NodeView](https://prosemirror.net/docs/ref/#view.NodeView)
  update?: (node: Node, decorations: readonly Decoration[], innerDecorations: DecorationSource) => boolean | void
  ignoreMutation?: (mutation: ViewMutationRecord) => boolean | void
  selectNode?: () => void
  deselectNode?: () => void
  setSelection?: (anchor: number, head: number, root: Document | ShadowRoot) => void
  stopEvent?: (event: Event) => boolean
  destroy?: () => void

  // Called when the node view is updated.
  onUpdate?: () => void
}
```

#### useNodeViewContext: () => NodeViewContext

```ts
interface NodeViewContext {
  // The DOM element that contains the content of the node.
  contentRef: NodeViewContentRef

  // The prosemirror editor view.
  view: EditorView

  // Get prosemirror position of current node view.
  getPos: () => number | undefined

  // Set node.attrs of current node.
  setAttrs: (attrs: Attrs) => void

  // The prosemirror node for current node.
  node: Node

  // The prosemirror decorations for current node.
  decorations: readonly Decoration[]

  // The prosemirror inner decorations for current node.
  innerDecorations: DecorationSource

  // Whether the node is selected.
  selected: boolean
}
```

</details>

<details>

<summary>

### Mark view API

</summary>

#### useMarkViewFactory: () => (options: MarkViewFactoryOptions) => MarkView

```ts
type MarkViewDOMSpec = string | HTMLElement | ((mark: Mark) => HTMLElement)

interface MarkViewFactoryOptions {
  // Component
  component: PreactComponent

  // The DOM element to use as the root node of the mark view
  as?: MarkViewDOMSpec

  // The DOM element that contains the content of the mark
  contentAs?: MarkViewDOMSpec

  // Called when the mark view is destroyed
  destroy?: () => void
}
```

#### useMarkViewContext: () => MarkViewContext

```ts
interface MarkViewContext {
  // The DOM element that contains the content of the mark
  contentRef: MarkViewContentRef

  // The prosemirror editor view
  view: EditorView

  // The prosemirror mark for current mark view
  mark: Mark

  // Whether the mark is inline
  inline: boolean
}
```

</details>

<details>

<summary>

### Plugin view API

</summary>

#### usePluginViewFactory: () => (options: PluginViewFactoryOptions) => PluginView

```ts
interface PluginViewFactoryOptions {
  // Component
  component: PreactComponent

  // The DOM element to use as the root node of the plugin view.
  // The `viewDOM` here means `EditorState.view.dom`.
  // By default, it will be `EditorState.view.dom.parentElement`.
  root?: (viewDOM: HTMLElement) => HTMLElement

  // Overrides: this part is equal to properties of [PluginView](https://prosemirror.net/docs/ref/#state.PluginView)
  update?: (view: EditorView, prevState: EditorState) => void
  destroy?: () => void
}
```

#### usePluginViewContext: () => PluginViewContext

```ts
interface PluginViewContext {
  // The prosemirror editor view.
  view: EditorView

  // The previously prosemirror editor state.
  // Will be `undefined` when the plugin view is created.
  prevState?: EditorState
}
```

</details>

<details>

<summary>

### Widget view API

</summary>

#### useWidgetViewFactory: () => (options: WidgetViewFactoryOptions) => WidgetDecorationFactory

```ts
type WidgetDecorationFactory = (pos: number, spec?: WidgetDecorationSpec) => Decoration

interface WidgetViewFactoryOptions {
  // Component
  component: PreactComponent

  // The DOM element to use as the root node of the widget view.
  as: string | HTMLElement
}
```

#### useWidgetViewContext: () => WidgetViewContext

```ts
interface WidgetViewContext {
  // The prosemirror editor view.
  view: EditorView

  // Get the position of the widget.
  getPos: () => number | undefined

  // Get the [spec](https://prosemirror.net/docs/ref/#view.Decoration^widget^spec) of the widget.
  spec?: WidgetDecorationSpec
}
```

</details>

## Contributing

Follow our [contribution guide](../../CONTRIBUTING.md) to learn how to contribute to prosemirror-adapter.

## License

[MIT](../../LICENSE)

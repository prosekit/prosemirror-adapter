# @prosemirror-adapter/solid

[Solid](https://docs.solidjs.com/) adapter for [ProseMirror](https://prosemirror.net/).

## Example

You can view the example in [prosemirror-adapter/examples/solid](../../examples/solid/).

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Saul-Mirone/prosemirror-adapter/tree/main/examples/solid)

## Getting Started

### Install the package

```bash
npm install @prosemirror-adapter/solid
```

### Wrap your component with provider

```tsx
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/solid'
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
import { useNodeViewContext } from '@prosemirror-adapter/solid'

function Paragraph() {
  const { contentRef, selected } = useNodeViewContext()
  return <div style={{ outline: selected ? 'blue solid 1px' : 'none' }} role="presentation" ref={contentRef} />
}
```

#### Bind node view components with prosemirror

```tsx
import { useNodeViewFactory } from '@prosemirror-adapter/solid'
import type { Component } from 'solid-js'
import { Paragraph } from './Paragraph'

export const YourAwesomeEditor: Component = () => {
  const nodeViewFactory = useNodeViewFactory()

  const editorRef = (element: HTMLDivElement) => {
    if (element.firstChild) return

    createEditorView(
      element,
      {
        paragraph: nodeViewFactory({
          component: Paragraph,
          as: 'div',
          contentAs: 'p',
        }),
      },
      [],
    )
  }

  return <div className="editor" ref={editorRef} />
}
```

🚀 Congratulations! You have built your first solid node view with prosemirror-adapter.

</details>

<details>

<summary>

### Play with mark view

</summary>

In this section we will implement a mark view for links that changes color periodically.

#### Build component for mark view

```tsx
import { useMarkViewContext } from '@prosemirror-adapter/solid'
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js'

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
  const [color, setColor] = createSignal(colors[0])
  const context = useMarkViewContext()
  const href = createMemo(() => context().mark.attrs.href as string)
  const title = createMemo(() => context().mark.attrs.title as string | null)

  createEffect(() => {
    const interval = setInterval(() => {
      setColor(pickRandomColor())
    }, 1000)
    return onCleanup(() => clearInterval(interval))
  })

  return (
    <a
      href={href()}
      title={title() || undefined}
      ref={context().contentRef}
      style={{ color: color(), transition: 'color 1s ease-in-out' }}
    ></a>
  )
}
```

#### Bind mark view components with prosemirror

```tsx
import { useMarkViewFactory } from '@prosemirror-adapter/solid'
import { Plugin } from 'prosemirror-state'
import { Link } from './Link'

export function Editor() {
  const markViewFactory = useMarkViewFactory()

  const editorRef = (element: HTMLElement) => {
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
  }

  return <div ref={editorRef} class="editor" />
}
```

🚀 Congratulations! You have built your first solid mark view with prosemirror-adapter.

</details>

<details>

<summary>

### Play with plugin view

</summary>

In this section we will implement a plugin view that will display the size of the document.

#### Build component for [plugin view](https://prosemirror.net/docs/ref/#state.PluginView)

```tsx
import { usePluginViewContext } from '@prosemirror-adapter/solid'
import { createMemo } from 'solid-js'

export function Size() {
  const context = usePluginViewContext()
  const size = createMemo(() => context().view.state.doc.nodeSize)

  return (
    <div>
      Size for document:
      {size()}
    </div>
  )
}
```

#### Bind plugin view components with prosemirror

```tsx
import { usePluginViewFactory } from '@prosemirror-adapter/solid'
import type { Component } from 'solid-js'
import { Plugin } from 'prosemirror-state'

import { Paragraph } from './Paragraph'

export const YourAwesomeEditor: Component = () => {
  const pluginViewFactory = usePluginViewFactory()

  const editorRef = (element: HTMLDivElement) => {
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
  }

  return <div className="editor" ref={editorRef} />
}
```

🚀 Congratulations! You have built your first solid plugin view with prosemirror-adapter.

</details>

<details>

<summary>

### Play with widget view

</summary>

In this section we will implement a widget view that will add hashes for heading when selected.

#### Build component for [widget decoration view](https://prosemirror.net/docs/ref/#view.Decoration%5Ewidget)

```tsx
import { useWidgetViewContext } from '@prosemirror-adapter/solid'
import { createMemo } from 'solid-js'

export function Hashes() {
  const context = useWidgetViewContext()
  const level = createMemo(() => context().spec?.level)
  const hashes = createMemo(() => new Array(level() || 0).fill('#').join(''))

  return <span style={{ color: 'blue', 'margin-right': '6px' }}>{hashes()}</span>
}
```

#### Bind widget view components with prosemirror

```tsx
import { useWidgetViewFactory } from '@prosemirror-adapter/solid'
import type { Component } from 'solid-js'
import { Plugin } from 'prosemirror-state'

import { Hashes } from './Hashes'

export const YourAwesomeEditor: Component = () => {
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

🚀 Congratulations! You have built your first solid widget view with prosemirror-adapter.

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
  component: SolidComponent

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
  node: ShallowRef<Node>

  // The prosemirror decorations for current node.
  decorations: ShallowRef<readonly Decoration[]>

  // The prosemirror inner decorations for current node.
  innerDecorations: ShallowRef<DecorationSource>

  // Whether the node is selected.
  selected: ShallowRef<boolean>
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
  component: Component<any>

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
  contentRef: (element: HTMLElement) => void

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
  component: SolidComponent

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
  view: ShallowRef<EditorView>

  // The previously prosemirror editor state.
  // Will be `undefined` when the plugin view is created.
  prevState: ShallowRef<EditorState | undefined>
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
  component: SolidComponent

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

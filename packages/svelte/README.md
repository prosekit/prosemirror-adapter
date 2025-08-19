# @prosemirror-adapter/svelte

[Svelte](https://svelte.dev/) adapter for [ProseMirror](https://prosemirror.net/).

## Example

You can view the example in [prosemirror-adapter/examples/svelte](../../examples/svelte/).

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Saul-Mirone/prosemirror-adapter/tree/main/examples/svelte)

## Getting Started

### Install the package

```bash
npm install @prosemirror-adapter/svelte
```

### Wrap your component with provider

```html
<script lang="ts">
  import { useProsemirrorAdapterProvider } from '@prosemirror-adapter/svelte'

  useProsemirrorAdapterProvider()
</script>

<YourAwesomeEditor />
```

<details>

<summary>

### Play with node view

</summary>

In this section we will implement a node view for paragraph node.

#### Build component for [node view](https://prosemirror.net/docs/ref/#view.NodeView)

```html
<script lang="ts">
  import { useNodeViewContext } from '@prosemirror-adapter/svelte'
  let selected = false

  const contentRef = useNodeViewContext('contentRef')
  const selectedStore = useNodeViewContext('selected')
  selectedStore.subscribe((value) => {
    selected = value
  })
</script>

<div use:contentRef class:selected="{selected}" />

<style>
  .selected {
    outline: blue solid 1px;
  }
</style>
```

#### Bind node view components with prosemirror

```html
<script lang="ts">
  import { useNodeViewFactory } from '@prosemirror-adapter/svelte'
  import Paragraph from './Paragraph.svelte'

  const nodeViewFactory = useNodeViewFactory()

  const editor = (element: HTMLElement) => {
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
  }
</script>

<div use:editor />
```

🚀 Congratulations! You have built your first svelte node view with prosemirror-adapter.

</details>

<details>

<summary>

### Play with mark view

</summary>

In this section we will implement a mark view for links that changes color periodically.

#### Build component for mark view

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { useMarkViewContext } from '@prosemirror-adapter/svelte'

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

  const { mark, contentRef } = useMarkViewContext()
  let color = colors[0]
  const href = $mark.attrs.href as string
  const title = $mark.attrs.title as string | null

  let interval: ReturnType<typeof setInterval>

  onMount(() => {
    interval = setInterval(() => {
      color = pickRandomColor()
    }, 1000)
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<a {href} use:contentRef style="color: {color}; transition: color 1s ease-in-out" title={title || undefined} />
```

#### Bind mark view components with prosemirror

```svelte
<script lang="ts">
  import { useMarkViewFactory } from '@prosemirror-adapter/svelte'
  import { Plugin } from 'prosemirror-state'
  import Link from './Link.svelte'

  const markViewFactory = useMarkViewFactory()

  function editorRef(element: HTMLElement) {
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
</script>

<div class="editor" bind:this={editorRef} />
```

🚀 Congratulations! You have built your first svelte mark view with prosemirror-adapter.

</details>

<details>

<summary>

### Play with plugin view

</summary>

In this section we will implement a plugin view that will display the size of the document.

#### Build component for [plugin view](https://prosemirror.net/docs/ref/#state.PluginView)

```html
<script lang="ts">
  import { usePluginViewContext } from '@prosemirror-adapter/svelte'
  const viewStore = usePluginViewContext('view')
  let size = 0

  viewStore.subscribe((view) => {
    size = view.state.doc.nodeSize
  })
</script>

<div>Size for document: { size }</div>
```

#### Bind plugin view components with prosemirror

```html
<script lang="ts">
  import { usePluginViewFactory } from '@prosemirror-adapter/svelte'
  import { Plugin } from 'prosemirror-state'
  import Size from './Size.svelte'

  const pluginViewFactory = usePluginViewFactory()

  const editor = (element: HTMLElement) => {
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
</script>

<div use:editor />
```

🚀 Congratulations! You have built your first svelte plugin view with prosemirror-adapter.

</details>

<details>

<summary>

### Play with widget view

</summary>

In this section we will implement a widget view that will add hashes for heading when selected.

#### Build component for [widget decoration view](https://prosemirror.net/docs/ref/#view.Decoration%5Ewidget)

```html
<script lang="ts">
  import { useWidgetViewContext } from '@prosemirror-adapter/svelte'

  const spec = useWidgetViewContext('spec')
  const level = spec?.level
  const hashes = Array(level || 0)
    .fill('#')
    .join('')
</script>

<span class="hash">{hashes}</span>

<style>
  .hash {
    color: blue;
    margin-right: 6px;
  }
</style>
```

#### Bind widget view components with prosemirror

```html
<script lang="ts">
  import { useWidgetViewFactory } from '@prosemirror-adapter/svelte'
  import { Plugin } from 'prosemirror-state'
  import Hashes from './Hashes.svelte'

  const widgetViewFactory = useWidgetViewFactory()

  const editor = (element: HTMLElement) => {
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
  }
</script>

<div use:editor />
```

🚀 Congratulations! You have built your first svelte widget view with prosemirror-adapter.

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
  component: SvelteComponent

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
  node: Writable<Node>

  // The prosemirror decorations for current node.
  decorations: Writable<readonly Decoration[]>

  // The prosemirror inner decorations for current node.
  innerDecorations: Writable<DecorationSource>

  // Whether the node is selected.
  selected: Writable<boolean>
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
  component: SvelteComponent

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
  contentRef: (node: HTMLElement) => void

  // The prosemirror editor view
  view: Writable<EditorView>

  // The prosemirror mark for current mark view
  mark: Writable<Mark>

  // Whether the mark is inline
  inline: Writable<boolean>
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
  component: SvelteComponent

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
  view: Writable<EditorView>

  // The previously prosemirror editor state.
  // Will be `undefined` when the plugin view is created.
  prevState: Writable<EditorState | undefined>
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
  component: SvelteComponent

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

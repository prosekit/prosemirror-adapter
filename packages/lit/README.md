# @prosemirror-adapter/lit

[Lit](https://lit.dev/) adapter for [ProseMirror](https://prosemirror.net/).

## Example

You can view the example in [prosemirror-adapter/examples/lit](../../examples/lit/).

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Saul-Mirone/prosemirror-adapter/tree/main/examples/lit)

## Getting Started

### Install the package

```bash
npm install @prosemirror-adapter/lit
```

### Wrap your component with provider

```ts

import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/lit'

class YourElement extends LitElement {
  render() {
    return html`
      <prosemirror-adapter-provider>
        <your-awesome-editor></your-awesome-editor/>
      </prosemirror-adapter-provider>
    `
  }
}
```

<details>

<summary>

### Play with node view

</summary>

In this section we will implement a node view for paragraph node.

#### Build component for [node view](https://prosemirror.net/docs/ref/#view.NodeView)

```ts

import { ShallowLitElement, useNodeViewContext } from '@prosemirror-adapter/lit'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { ref } from 'lit/directives/ref.js'

@customElement('my-paragraph')
export class Paragraph extends ShallowLitElement {
  nodeViewContext = useNodeViewContext(this)

  override render() {
    const contentRef = this.nodeViewContext.value?.contentRef
    if (!contentRef)
      return

    return html`<div ${ref(contentRef)}></div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-paragraph': Paragraph
  }
}
```

#### Bind node view components with prosemirror

```ts

import {
  ShallowLitElement,
  useNodeViewFactory,
} from '@prosemirror-adapter/lit'
import type { RefOrCallback} from 'lit/directives/ref.js';
import { ref } from 'lit/directives/ref.js'
import Paragraph from './Paragraph.ts'

@customElement('my-editor')
export class MyEditor extends ShallowLitElement {
  nodeViewFactory = useNodeViewFactory(this)

  editorRef: RefOrCallback = (element) => {
    const nodeViewFactory = this.nodeViewFactory.value!
    const editorView = new EditorView(element, {
      state: YourProsemirrorEditorState,
      nodeViews: {
        paragraph: this.nodeViewFactory({
          component: Paragraph,
          // Optional: add some options
          as: 'div',
          contentAs: 'p',
        }),
      },
    })
  }

  override render() {
    return html`<div class="editor" ${ref(this.editorRef)}></div>`
  }
}
```

🚀 Congratulations! You have built your first lit node view with prosemirror-adapter.

</details>

<details>

<summary>

### Play with mark view

</summary>

In this section we will implement a mark view for links that changes color periodically.

#### Build component for mark view

```ts
import { ShallowLitElement, useMarkViewContext } from '@prosemirror-adapter/lit'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { ref } from 'lit/directives/ref.js'

const colors = [
  '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6',
  '#4fc3f7', '#4dd0e1', '#4db6ac', '#81c784', '#aed581',
  '#ffb74d', '#ffa726', '#ff8a65', '#d4e157', '#ffd54f',
  '#ffecb3',
]

function pickRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}

@customElement('my-link')
export class Link extends ShallowLitElement {
  markViewContext = useMarkViewContext(this)

  @state()
  color = colors[0]

  timer: ReturnType<typeof setInterval> | null = null

  override render() {
    const ctx = this.markViewContext.value
    if (!ctx)
      return
    const { contentRef } = ctx
    return html`<a style="color: ${this.color}; transition: color 1s ease-in-out;" ${ref(contentRef)}></a>`
  }

  override connectedCallback() {
    super.connectedCallback()
    this.timer = setInterval(() => {
      this.color = pickRandomColor()
    }, 1000)
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-link': Link
  }
}
```

#### Bind mark view components with prosemirror

```ts
import { useMarkViewFactory } from '@prosemirror-adapter/lit'
import { Plugin } from 'prosemirror-state'
import './Link'

const markViewFactory = useMarkViewFactory()

function createEditor(element: HTMLElement) {
  if (!element || element.firstChild)
    return

  const editorView = new EditorView(element, {
    state: EditorState.create({
      schema: YourProsemirrorSchema,
      plugins: [
        new Plugin({
          props: {
            markViews: {
              link: markViewFactory({
                component: 'my-link',
              }),
            },
          },
        }),
      ]
    })
  })
}
```

🚀 Congratulations! You have built your first lit mark view with prosemirror-adapter.

</details>

<details>

<summary>

### Play with plugin view

</summary>

In this section we will implement a plugin view that will display the size of the document.

#### Build component for [plugin view](https://prosemirror.net/docs/ref/#state.PluginView)

```ts

import { ShallowLitElement, usePluginViewContext } from '@prosemirror-adapter/lit'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('my-size')
export class Size extends ShallowLitElement {
  pluginViewContext = usePluginViewContext(this)

  override render() {
    const size = this.pluginViewContext.value?.view.state.doc.nodeSize

    return html`<div>Size for document: ${size}</div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-size': Size
  }
}
```

#### Bind plugin view components with prosemirror

```ts

import {
  ShallowLitElement,
  usePluginViewFactory,
} from '@prosemirror-adapter/lit'
import type { RefOrCallback} from 'lit/directives/ref.js';
import { ref } from 'lit/directives/ref.js'
import { Plugin } from 'prosemirror-state'
import Size from './Size.ts'

@customElement('my-editor')
export class MyEditor extends ShallowLitElement {
  pluginViewFactory = usePluginViewFactory(this)

  editorRef: RefOrCallback = (element) => {
    const pluginViewFactory = this.pluginViewFactory.value!
    const editorView = new EditorView(element, {
      state: YourProsemirrorEditorState,
      plugins: [
        new Plugin({
          view: pluginViewFactory({
            component: Size,
          }),
        }),
      ]
    })
  }

  override render() {
    return html`<div class="editor" ${ref(this.editorRef)}></div>`
  }
}
```

🚀 Congratulations! You have built your first lit plugin view with prosemirror-adapter.

</details>

<details>

<summary>

### Play with widget view

</summary>

In this section we will implement a widget view that will add hashes for heading when selected.

#### Build component for [widget decoration view](https://prosemirror.net/docs/ref/#view.Decoration%5Ewidget)

```ts

import { ShallowLitElement, useWidgetViewContext } from '@prosemirror-adapter/lit'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('my-hashes')
export class Hashes extends ShallowLitElement {
  widgetViewContext = useWidgetViewContext(this)

  override render() {
    const spec = this.widgetViewContext.value?.spec
    const level = spec?.level ?? 0
    const hashes = Array(level).fill('#').join('')
    return html`<span class="hash">${hashes}</span>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-hashes': Hashes
  }
}
```

#### Bind widget view components with prosemirror

```ts

import {
  ShallowLitElement,
  useWidgetViewFactory,
} from '@prosemirror-adapter/lit'
import type { RefOrCallback} from 'lit/directives/ref.js';
import { ref } from 'lit/directives/ref.js'
import { Plugin } from 'prosemirror-state'
import { Hashes } from './Hashes'

@customElement('my-editor')
export class MyEditor extends ShallowLitElement {
  widgetViewFactory = useWidgetViewFactory(this)

  editorRef: RefOrCallback = (element) => {
    const widgetViewFactory = this.widgetViewFactory.value!
    const getHashWidget = widgetViewFactory({
      as: 'i',
      component: Hashes,
    })
    const editorView = new EditorView(element, {
      state: YourProsemirrorEditorState,
      plugins: [
        new Plugin({
          props: {
            decorations(state) {
              const { $from } = state.selection
              const node = $from.node()
              if (node.type.name !== 'heading')
                return DecorationSet.empty

              const widget = getHashWidget($from.before() + 1, {
                side: -1,
                level: node.attrs.level,
              })

              return DecorationSet.create(state.doc, [widget])
            },
          },
        }),
      ]
    })
  }

  override render() {
    return html`<div class="editor" ${ref(this.editorRef)}></div>`
  }
}
```

🚀 Congratulations! You have built your first lit widget view with prosemirror-adapter.

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
  component: LitComponent

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
  component: string | typeof LitElement

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
  contentRef: DirectiveResult

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
  component: LitComponent

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
  component: LitComponent

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

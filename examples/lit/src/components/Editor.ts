import {
  ShallowLitElement,
  useNodeViewFactory,
  usePluginViewFactory,
  useWidgetViewFactory,
} from '@prosemirror-adapter/lit'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import type { RefOrCallback } from 'lit/directives/ref.js'
import { ref } from 'lit/directives/ref.js'
import { Plugin } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import { DecorationSet } from 'prosemirror-view'

import { createEditorView } from '../createEditorView'

import { Hashes } from './Hashes'
import { Heading } from './Heading'
import { Paragraph } from './Paragraph'
import { Size } from './Size'

@customElement('my-editor')
export class MyEditor extends ShallowLitElement {
  nodeViewFactory = useNodeViewFactory(this)
  pluginViewFactory = usePluginViewFactory(this)
  widgetViewFactory = useWidgetViewFactory(this)

  editorView!: EditorView

  editorRef: RefOrCallback = (element) => {
    if (!element || element.firstChild || !(element instanceof HTMLElement))
      return

    const nodeViewFactory = this.nodeViewFactory.value!
    const pluginViewFactory = this.pluginViewFactory.value!
    const widgetViewFactory = this.widgetViewFactory.value!
    const getHashWidget = widgetViewFactory({
      as: 'i',
      component: Hashes,
    })

    this.editorView = createEditorView(element, {
      paragraph: nodeViewFactory({
        component: Paragraph,
        as: 'div',
        contentAs: 'p',
      }),
      heading: nodeViewFactory({
        component: Heading,
      }),
    }, [
      new Plugin({
        view: pluginViewFactory({
          component: Size,
        }),
      }),
      new Plugin({
        props: {
          decorations(state) {
            const { $from } = state.selection
            const node = $from.node()
            if (node.type.name !== 'heading')
              return DecorationSet.empty

            const widget = getHashWidget($from.before() + 1, {
              side: -1,
              level: node.attrs.level as number,
            })

            return DecorationSet.create(state.doc, [widget])
          },
        },
      }),
    ])
  }

  override disconnectedCallback() {
    this.editorView.destroy()
    super.disconnectedCallback()
  }

  override render() {
    return html`<div class="editor" ${ref(this.editorRef)}></div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-editor': MyEditor
  }
}

import type { Context } from '@lit-labs/context'
import { ContextProvider } from '@lit-labs/context'
import { CoreNodeView } from '@prosemirror-adapter/core'
import { customElement } from 'lit/decorators.js'
import { nanoid } from 'nanoid'

import type { LitRenderer } from '../LitRenderer'
import { ShallowLitElement } from '../utils'

import type { LitNodeViewComponent } from './LitNodeViewOptions'
import type { NodeViewContext } from './nodeViewContext'
import { nodeViewContextKey } from './nodeViewContext'

declare global {
  interface HTMLElementTagNameMap {
    'node-view-dom-provider': NodeViewDOMProvider
  }
}

@customElement('node-view-dom-provider')
export class NodeViewDOMProvider extends ShallowLitElement {
  nodeView!: LitNodeView

  provider!: ContextProvider<Context<typeof nodeViewContextKey, NodeViewContext>>

  override createRenderRoot() {
    return this
  }

  constructor(nodeView: LitNodeView) {
    super()
    if (!nodeView) return

    this.nodeView = nodeView
    this.provider = new ContextProvider(this, nodeViewContextKey, this.nodeView.context)
  }

  create = () => {
    this.nodeView.dom.appendChild(this)
    const UserComponent = this.nodeView.component
    const userComponent = new UserComponent()
    this.appendChild(userComponent)
    return userComponent
  }

  updateContext = () => {
    this.provider.setValue(this.nodeView.context)
  }
}

export class LitNodeView extends CoreNodeView<LitNodeViewComponent> implements LitRenderer<NodeViewContext> {
  key: string = nanoid()

  provider!: NodeViewDOMProvider

  context: NodeViewContext = {
    contentRef: (element) => {
      if (element && element instanceof HTMLElement && this.contentDOM && element.firstChild !== this.contentDOM) {
        element.appendChild(this.contentDOM)
      }
    },
    view: this.view,
    getPos: this.getPos,
    setAttrs: this.setAttrs,

    node: this.node,
    selected: this.selected,
    decorations: this.decorations,
    innerDecorations: this.innerDecorations,
  }

  updateContext = () => {
    const next = {
      node: this.node,
      selected: this.selected,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
    }
    this.context = {
      ...this.context,
      ...next,
    }
    this.provider?.updateContext()
  }

  render = () => {
    this.updateContext()
    this.provider = new NodeViewDOMProvider(this)
    return this.provider.create()
  }
}

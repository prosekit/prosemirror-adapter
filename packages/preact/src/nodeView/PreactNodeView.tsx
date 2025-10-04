import { CoreNodeView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import { h } from 'preact'
import { createPortal } from 'preact/compat'

import type { PreactRenderer } from '../PreactRenderer'

import type { PreactNodeViewComponent } from './PreactNodeViewOptions'
import type { NodeViewContext } from './nodeViewContext'
import { nodeViewContext } from './nodeViewContext'

export class PreactNodeView extends CoreNodeView<PreactNodeViewComponent> implements PreactRenderer<NodeViewContext> {
  key: string = nanoid()

  context: NodeViewContext = {
    contentRef: (element) => {
      if (element && this.contentDOM && element.firstChild !== this.contentDOM) element.appendChild(this.contentDOM)
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
    Object.assign(this.context, {
      node: this.node,
      selected: this.selected,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
    })
  }

  render = () => {
    const UserComponent = this.component

    return createPortal(h(nodeViewContext.Provider, { value: this.context }, h(UserComponent, {})), this.dom, this.key)
  }
}

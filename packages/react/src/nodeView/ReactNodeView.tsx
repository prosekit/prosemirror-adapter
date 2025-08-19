import { CoreNodeView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import React from 'react'
import { createPortal } from 'react-dom'

import type { ReactRenderer } from '../ReactRenderer'

import type { ReactNodeViewComponent } from './ReactNodeViewOptions'
import type { NodeViewContext } from './nodeViewContext'
import { nodeViewContext } from './nodeViewContext'

export class ReactNodeView extends CoreNodeView<ReactNodeViewComponent> implements ReactRenderer<NodeViewContext> {
  key: string = nanoid()

  context: NodeViewContext = {
    contentRef: (element) => {
      if (element && this.contentDOM && element.firstChild !== this.contentDOM)
        element.appendChild(this.contentDOM)
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

    return createPortal(
      <nodeViewContext.Provider value={this.context}>
        <UserComponent />
      </nodeViewContext.Provider>,
      this.dom,
      this.key,
    )
  }
}

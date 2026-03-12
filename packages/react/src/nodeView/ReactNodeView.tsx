import { CoreNodeView } from '@prosemirror-adapter/core'
import { createPortal } from 'react-dom'

import type { ReactRenderer } from '../ReactRenderer'

import type { NodeViewContext } from './nodeViewContext'
import { nodeViewContext } from './nodeViewContext'
import type { ReactNodeViewComponent } from './ReactNodeViewOptions'

export class ReactNodeView extends CoreNodeView<ReactNodeViewComponent> implements ReactRenderer<NodeViewContext> {
  context: NodeViewContext = {
    contentRef: this.contentRef,
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

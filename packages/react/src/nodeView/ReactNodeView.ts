import { CoreNodeView } from '@prosemirror-adapter/core'
import { createElement } from 'react'
import { createPortal } from 'react-dom'

import type { ReactRenderer } from '../ReactRenderer'

import type { NodeViewContext } from './nodeViewContext'
import { nodeViewContext } from './nodeViewContext'
import type { ReactNodeViewComponent } from './ReactNodeViewOptions'

/**
 * @internal
 */
export class ReactHeadlessNodeView<ComponentType> extends CoreNodeView<ComponentType> {
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
}

export class ReactNodeView
  extends ReactHeadlessNodeView<ReactNodeViewComponent>
  implements ReactRenderer<NodeViewContext>
{
  render = () => {
    const UserComponent = this.component

    return createPortal(
      createElement(nodeViewContext.Provider, { value: this.context }, createElement(UserComponent, null)),
      this.dom,
      this.key,
    )
  }
}

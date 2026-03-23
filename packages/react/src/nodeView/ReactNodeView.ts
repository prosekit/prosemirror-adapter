import { CoreNodeView } from '@prosemirror-adapter/core'
import type { ReactPortal } from 'react'
import { createElement } from 'react'
import { createPortal } from 'react-dom'

import type { ReactRenderer } from '../ReactRenderer'

import type { NodeViewContext } from './nodeViewContext'
import { nodeViewContext } from './nodeViewContext'
import type { ReactNodeViewComponent } from './ReactNodeViewOptions'

/**
 * @internal
 */
export abstract class AbstractReactNodeView
  extends CoreNodeView<ReactNodeViewComponent>
  implements ReactRenderer<NodeViewContext>
{
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

  abstract render: () => ReactPortal
}

export class ReactNodeView extends AbstractReactNodeView implements ReactRenderer<NodeViewContext> {
  render = () => {
    const UserComponent = this.component

    return createPortal(
      createElement(nodeViewContext.Provider, { value: this.context }, createElement(UserComponent, null)),
      this.dom,
      this.key,
    )
  }
}

import { CoreNodeView } from '@prosemirror-adapter/core'
import type { VNode } from 'preact'
import { createElement } from 'preact'
import { createPortal } from 'preact/compat'

import type { PreactRenderer } from '../PreactRenderer'

import type { NodeViewContext } from './nodeViewContext'
import { nodeViewContext } from './nodeViewContext'
import type { PreactNodeViewComponent } from './PreactNodeViewOptions'

/**
 * @internal
 */
export abstract class AbstractPreactNodeView
  extends CoreNodeView<PreactNodeViewComponent>
  implements PreactRenderer<NodeViewContext>
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

  abstract render: () => VNode
}

export class PreactNodeView extends AbstractPreactNodeView implements PreactRenderer<NodeViewContext> {
  render = () => {
    const UserComponent = this.component

    return createPortal(
      createElement(nodeViewContext.Provider, { value: this.context }, createElement(UserComponent, null)),
      this.dom,
    )
  }
}

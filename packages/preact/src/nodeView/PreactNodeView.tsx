import { CoreNodeView } from '@prosemirror-adapter/core'
import { createPortal } from 'preact/compat'

import type { PreactRenderer } from '../PreactRenderer'

import type { NodeViewContext } from './nodeViewContext'
import { nodeViewContext } from './nodeViewContext'
import type { PreactNodeViewComponent } from './PreactNodeViewOptions'

/**
 * @internal
 */
export class PreactHeadlessNodeView<ComponentType> extends CoreNodeView<ComponentType> {
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

export class PreactNodeView
  extends PreactHeadlessNodeView<PreactNodeViewComponent>
  implements PreactRenderer<NodeViewContext>
{
  render = () => {
    const UserComponent = this.component

    return createPortal(
      <nodeViewContext.Provider value={this.context}>
        <UserComponent />
      </nodeViewContext.Provider>,
      this.dom,
    )
  }
}

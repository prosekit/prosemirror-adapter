import { CoreNodeView, type CoreNodeViewSpec } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import type { Setter } from 'solid-js'
import { createSignal } from 'solid-js'
import { Dynamic, Portal } from 'solid-js/web'

import type { SolidRenderer } from '../SolidRenderer'
import { hidePortalDiv } from '../utils/hidePortalDiv'

import type { SolidNodeViewComponent } from './SolidNodeViewOptions'
import type { NodeViewContext, NodeViewContextProps } from './nodeViewContext'
import { nodeViewContext } from './nodeViewContext'

export class SolidNodeView extends CoreNodeView<SolidNodeViewComponent> implements SolidRenderer<NodeViewContext> {
  key: string = nanoid()
  context: NodeViewContext

  private setContext: Setter<NodeViewContextProps>

  constructor(spec: CoreNodeViewSpec<SolidNodeViewComponent>) {
    super(spec)
    const [context, setContext] = createSignal<NodeViewContextProps>({
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
    })

    this.context = context
    this.setContext = setContext
  }

  updateContext = () => {
    this.setContext((prev) => ({
      ...prev,
      node: this.node,
      selected: this.selected,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
    }))
  }

  render = () => {
    const UserComponent = this.component

    return (
      <Portal mount={this.dom} ref={(el) => hidePortalDiv(el)}>
        <nodeViewContext.Provider value={this.context}>
          <Dynamic component={UserComponent} />
        </nodeViewContext.Provider>
      </Portal>
    )
  }
}

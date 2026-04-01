import { CoreNodeView } from '@prosemirror-adapter/core'
import { defineComponent, h, markRaw, provide, shallowRef, Teleport } from 'vue'

import type { VueRenderer, VueRendererComponent } from '../VueRenderer'

import type { NodeViewContext } from './nodeViewContext'
import { nodeViewContext } from './nodeViewContext'
import type { VueNodeViewComponent } from './VueNodeViewOptions'

/**
 * @internal
 */
export abstract class AbstractVueNodeView<ComponentType>
  extends CoreNodeView<ComponentType>
  implements VueRenderer<NodeViewContext>
{
  context: NodeViewContext = {
    contentRef: this.contentRef,
    view: this.view,
    getPos: this.getPos,
    setAttrs: this.setAttrs,

    node: shallowRef(this.node),
    selected: shallowRef(this.selected),
    decorations: shallowRef(this.decorations),
    innerDecorations: shallowRef(this.innerDecorations),
  }

  updateContext = () => {
    const ctx = this.context
    ctx.node.value = this.node
    ctx.selected.value = this.selected
    ctx.decorations.value = this.decorations
    ctx.innerDecorations.value = this.innerDecorations
  }

  abstract render: () => VueRendererComponent
}

export class VueNodeView extends AbstractVueNodeView<VueNodeViewComponent> implements VueRenderer<NodeViewContext> {
  render = () => {
    const UserComponent = this.component

    return markRaw(
      defineComponent({
        name: 'ProsemirrorNodeView',
        setup: () => {
          provide(nodeViewContext, this.context)
          return () => h(Teleport, { key: this.key, to: this.dom }, [h(UserComponent)])
        },
      }),
    ) as VueRendererComponent
  }
}

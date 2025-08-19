
import { CoreNodeView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import { defineComponent, markRaw, provide, shallowRef, Teleport } from 'vue'

import type { VueRenderer, VueRendererComponent } from '../VueRenderer'

import type { VueNodeViewComponent } from './VueNodeViewOptions'
import type { NodeViewContext } from './nodeViewContext'
import { nodeViewContext } from './nodeViewContext'

export class VueNodeView extends CoreNodeView<VueNodeViewComponent> implements VueRenderer<NodeViewContext> {
  key: string = nanoid()

  context: NodeViewContext = {
    contentRef: (element) => {
      if (
        element
        && element instanceof HTMLElement
        && this.contentDOM
        && element.firstChild !== this.contentDOM
      ) {
        element.appendChild(this.contentDOM)
      }
    },
    view: this.view,
    getPos: this.getPos,
    setAttrs: this.setAttrs,

    node: shallowRef(this.node),
    selected: shallowRef(this.selected),
    decorations: shallowRef(this.decorations),
    innerDecorations: shallowRef(this.innerDecorations),
  }

  updateContext = () => {
    Object.entries({
      node: this.node,
      selected: this.selected,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
    }).forEach(([key, value]) => {
      const prev = this.context[key as 'node' | 'selected' | 'decorations' | 'innerDecorations']
      if (prev.value !== value)
        prev.value = value
    })
  }

  render = () => {
    const UserComponent = this.component

    return markRaw(
      defineComponent({
        name: 'ProsemirrorNodeView',
        setup: () => {
          provide(nodeViewContext, this.context)
          return () => (
            <Teleport key={this.key} to={this.dom}>
              <UserComponent />
            </Teleport>
          )
        },
      }),
    ) as VueRendererComponent
  }
}

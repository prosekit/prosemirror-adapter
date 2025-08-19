
import { CoreMarkView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import { defineComponent, markRaw, provide, shallowRef, Teleport } from 'vue'

import type { VueRenderer, VueRendererComponent } from '../VueRenderer'

import type { VueMarkViewComponent } from './VueMarkViewOptions'
import type { MarkViewContext } from './markViewContext'
import { markViewContext } from './markViewContext'

export class VueMarkView
  extends CoreMarkView<VueMarkViewComponent>
  implements VueRenderer<MarkViewContext> {
  key: string = nanoid()

  context: MarkViewContext = {
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
    mark: shallowRef(this.mark),
  }

  updateContext = () => {
    Object.entries({
      mark: this.mark,
    }).forEach(([key, value]) => {
      const prev = this.context[key as 'mark']
      if (prev.value !== value)
        prev.value = value
    })
  }

  render = () => {
    const UserComponent = this.component

    return markRaw(
      defineComponent({
        name: 'ProsemirrorMarkView',
        setup: () => {
          provide(markViewContext, this.context)
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

import { CoreMarkView } from '@prosemirror-adapter/core'
import { defineComponent, h, markRaw, provide, shallowRef, Teleport } from 'vue'

import type { VueRenderer, VueRendererComponent } from '../VueRenderer'

import type { MarkViewContext } from './markViewContext'
import { markViewContext } from './markViewContext'
import type { VueMarkViewComponent } from './VueMarkViewOptions'

/**
 * @internal
 */
export abstract class AbstractVueMarkView
  extends CoreMarkView<VueMarkViewComponent>
  implements VueRenderer<MarkViewContext>
{
  context: MarkViewContext = {
    contentRef: this.contentRef,
    view: this.view,
    mark: shallowRef(this.mark),
  }

  updateContext = (): void => {
    const ctx = this.context
    if (ctx.mark.value !== this.mark) ctx.mark.value = this.mark
  }

  abstract render: () => VueRendererComponent
}

export class VueMarkView extends AbstractVueMarkView implements VueRenderer<MarkViewContext> {
  render = () => {
    const UserComponent = this.component

    return markRaw(
      defineComponent({
        name: 'ProsemirrorMarkView',
        setup: () => {
          provide(markViewContext, this.context)
          return () => h(Teleport, { key: this.key, to: this.dom }, [h(UserComponent)])
        },
      }),
    ) as VueRendererComponent
  }
}

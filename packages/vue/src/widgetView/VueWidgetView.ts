import { CoreWidgetView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import { defineComponent, h, markRaw, provide, Teleport } from 'vue'

import type { VueRenderer, VueRendererComponent } from '../VueRenderer'

import type { VueWidgetViewComponent } from './VueWidgetViewOptions'
import type { WidgetViewContext } from './widgetViewContext'
import { widgetViewContext } from './widgetViewContext'

export class VueWidgetView extends CoreWidgetView<VueWidgetViewComponent> implements VueRenderer<WidgetViewContext> {
  key: string = nanoid()

  context: WidgetViewContext = {
    view: this.view!,
    getPos: this.getPos!,
    spec: this.spec,
  }

  updateContext = () => {
    Object.assign(this.context, {
      view: this.view,
      getPos: this.getPos,
      spec: this.spec,
    })
  }

  render = () => {
    const UserComponent = this.component

    return markRaw(
      defineComponent({
        name: 'ProsemirrorWidgetView',
        setup: () => {
          provide(widgetViewContext, this.context)
          return () => h(Teleport, { key: this.key, to: this.dom }, [h(UserComponent)])
        },
      }),
    ) as VueRendererComponent
  }
}

import { CorePluginView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import { defineComponent, h, markRaw, provide, shallowRef, Teleport } from 'vue'

import type { VueRenderer, VueRendererComponent } from '../VueRenderer'

import type { PluginViewContext } from './pluginViewContext'
import { pluginViewContext } from './pluginViewContext'
import type { VuePluginViewComponent } from './VuePluginViewOptions'

export class VuePluginView extends CorePluginView<VuePluginViewComponent> implements VueRenderer<PluginViewContext> {
  key: string = nanoid()

  context: PluginViewContext = {
    view: shallowRef(this.view),
    prevState: shallowRef(this.prevState),
  }

  updateContext = () => {
    const ctx = this.context

    if (ctx.view.value !== this.view) ctx.view.value = this.view
    if (ctx.prevState.value !== this.prevState) ctx.prevState.value = this.prevState
  }

  render = () => {
    const UserComponent = this.component

    return markRaw(
      defineComponent({
        name: 'ProsemirrorNodeView',
        setup: () => {
          provide(pluginViewContext, this.context)
          return () => h(Teleport, { key: this.key, to: this.root }, [h(UserComponent)])
        },
      }),
    ) as VueRendererComponent
  }
}

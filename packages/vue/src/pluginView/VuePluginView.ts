import { CorePluginView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import { defineComponent, h, markRaw, provide, shallowRef, Teleport } from 'vue'

import type { VueRenderer, VueRendererComponent } from '../VueRenderer'

import type { VuePluginViewComponent } from './VuePluginViewOptions'
import type { PluginViewContext } from './pluginViewContext'
import { pluginViewContext } from './pluginViewContext'

export class VuePluginView extends CorePluginView<VuePluginViewComponent> implements VueRenderer<PluginViewContext> {
  key: string = nanoid()

  context: PluginViewContext = {
    view: shallowRef(this.view),
    prevState: shallowRef(this.prevState),
  }

  updateContext = () => {
    Object.entries({
      view: this.view,
      prevState: this.prevState,
    }).forEach(([key, value]) => {
      const prev = this.context[key as 'view' | 'prevState']
      if (key === 'view') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const clone = Object.assign(Object.create(Object.getPrototypeOf(value) as object | null), value)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        prev.value = clone
        return
      }

      prev.value = value
    })
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

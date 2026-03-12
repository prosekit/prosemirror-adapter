import { defineComponent, Fragment, h, provide } from 'vue'

import { markViewFactoryKey } from './markView'
import { useVueMarkViewCreator } from './markView/useVueMarkViewCreator'
import { nodeViewFactoryKey } from './nodeView'
import { useVueNodeViewCreator } from './nodeView/useVueNodeViewCreator'
import { pluginViewFactoryKey } from './pluginView'
import { useVuePluginViewCreator } from './pluginView/useVuePluginViewCreator'
import { useVueRenderer } from './VueRenderer'
import { useVueWidgetViewCreator } from './widgetView/useVueWidgetViewCreator'
import { widgetViewFactoryKey } from './widgetView/widgetViewContext'

export type CreateVueNodeView = ReturnType<typeof useVueNodeViewCreator>
export type CreateVueMarkView = ReturnType<typeof useVueMarkViewCreator>
export type CreateVuePluginView = ReturnType<typeof useVuePluginViewCreator>
export type CreateVueWidgetView = ReturnType<typeof useVueWidgetViewCreator>

export const ProsemirrorAdapterProvider = defineComponent({
  name: 'ProsemirrorAdapterProvider',
  setup: (_, { slots }) => {
    const { portal, renderVueRenderer, removeVueRenderer } = useVueRenderer()

    const createVueNodeView: CreateVueNodeView = useVueNodeViewCreator(renderVueRenderer, removeVueRenderer)
    const createVueMarkView: CreateVueMarkView = useVueMarkViewCreator(renderVueRenderer, removeVueRenderer)
    const createVuePluginView: CreateVuePluginView = useVuePluginViewCreator(renderVueRenderer, removeVueRenderer)
    const createVueWidgetView: CreateVueWidgetView = useVueWidgetViewCreator(renderVueRenderer, removeVueRenderer)

    provide(nodeViewFactoryKey, createVueNodeView)
    provide(markViewFactoryKey, createVueMarkView)
    provide(pluginViewFactoryKey, createVuePluginView)
    provide(widgetViewFactoryKey, createVueWidgetView)

    return () => {
      return h(Fragment, null, [h(Fragment, { key: 1 }, slots.default?.()), h(Fragment, { key: 2 }, [portal.value])])
    }
  },
})

import { setContext } from 'svelte'

import { useSvelteRenderer } from './SvelteRenderer'
import { markViewFactoryKey } from './markView'
import { useSvelteMarkViewCreator } from './markView/useSvelteMarkViewCreator'
import { nodeViewFactoryKey } from './nodeView'
import { useSvelteNodeViewCreator } from './nodeView/useSvelteNodeViewCreator'
import { pluginViewFactoryKey } from './pluginView'
import { useSveltePluginViewCreator } from './pluginView/useSveltePluginViewCreator'
import { widgetViewFactoryKey } from './widgetView'
import { useSvelteWidgetViewCreator } from './widgetView/useSvelteWidgetViewCreator'

export function useProsemirrorAdapterProvider() {
  const {
    renderSvelteRenderer,
    removeSvelteRenderer,
  } = useSvelteRenderer()

  const createSvelteNodeView = useSvelteNodeViewCreator(renderSvelteRenderer, removeSvelteRenderer)
  const createSvelteMarkView = useSvelteMarkViewCreator(renderSvelteRenderer, removeSvelteRenderer)
  const createSveltePluginView = useSveltePluginViewCreator(renderSvelteRenderer, removeSvelteRenderer)
  const createSvelteWidgetView = useSvelteWidgetViewCreator(renderSvelteRenderer, removeSvelteRenderer)

  setContext(nodeViewFactoryKey, createSvelteNodeView)
  setContext(markViewFactoryKey, createSvelteMarkView)
  setContext(pluginViewFactoryKey, createSveltePluginView)
  setContext(widgetViewFactoryKey, createSvelteWidgetView)
}

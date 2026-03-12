import type { VueRendererResult } from '../VueRenderer'

import type { PluginViewFactory } from './pluginViewContext'
import { VuePluginView } from './VuePluginView'

export function useVuePluginViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
) {
  const createVuePluginView: PluginViewFactory = (options) => (view) => {
    const pluginView = new VuePluginView({
      view,
      options: {
        ...options,
        update: (view, prevState) => {
          options.update?.(view, prevState)
          pluginView.updateContext()
        },
        destroy: () => {
          options.destroy?.()
          removeVueRenderer(pluginView)
        },
      },
    })

    renderVueRenderer(pluginView)

    return pluginView
  }

  return createVuePluginView
}

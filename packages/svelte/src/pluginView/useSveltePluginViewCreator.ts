import type { SvelteRendererResult } from '../SvelteRenderer'

import { SveltePluginView } from './SveltePluginView'
import type { PluginViewFactory } from './pluginViewContext'

export function useSveltePluginViewCreator(renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'], removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer']) {
  const createSveltePluginView: PluginViewFactory = options => (view) => {
    const pluginView = new SveltePluginView({
      view,
      options: {
        ...options,
        update: (view, prevState) => {
          options.update?.(view, prevState)
          pluginView.updateContext()
        },
        destroy: () => {
          options.destroy?.()
          removeSvelteRenderer(pluginView)
        },
      },
    })

    renderSvelteRenderer(pluginView)

    return pluginView
  }

  return createSveltePluginView
}

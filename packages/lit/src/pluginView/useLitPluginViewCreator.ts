import type { LitRendererResult } from '../LitRenderer'

import { LitPluginView } from './LitPluginView'
import type { PluginViewFactory } from './pluginViewContext'

export function useLitPluginViewCreator(
  renderLitRenderer: LitRendererResult['renderLitRenderer'],
  removeLitRenderer: LitRendererResult['removeLitRenderer'],
) {
  const createLitPluginView: PluginViewFactory = (options) => (view) => {
    const pluginView = new LitPluginView({
      view,
      options: {
        ...options,
        update: (view, prevState) => {
          options.update?.(view, prevState)
          pluginView.updateContext()
        },
        destroy: () => {
          options.destroy?.()
          removeLitRenderer(pluginView)
        },
      },
    })

    renderLitRenderer(pluginView)

    return pluginView
  }

  return createLitPluginView
}

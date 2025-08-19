import type { PluginViewSpec } from '@prosemirror-adapter/core'

import type { SolidRendererResult } from '../SolidRenderer'

import { SolidPluginView } from './SolidPluginView'
import type { SolidPluginViewUserOptions } from './SolidPluginViewOptions'

export function useSolidPluginViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
) {
  const createSolidPluginView = (
    options: SolidPluginViewUserOptions,
  ): PluginViewSpec => {
    return (view) => {
      const pluginView = new SolidPluginView({
        view,
        options: {
          ...options,
          update: (view, prevState) => {
            options.update?.(view, prevState)
            pluginView.updateContext()
          },
          destroy: () => {
            options.destroy?.()
            removeSolidRenderer(pluginView)
          },
        },
      })

      renderSolidRenderer(pluginView)

      return pluginView
    }
  }

  return createSolidPluginView
}

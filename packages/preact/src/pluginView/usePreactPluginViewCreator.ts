import type { PluginViewSpec } from '@prosemirror-adapter/core'
import { useCallback } from 'preact/hooks'

import type { PreactRendererResult } from '../PreactRenderer'

import { PreactPluginView } from './PreactPluginView'
import type { PreactPluginViewUserOptions } from './PreactPluginViewOptions'

export function usePreactPluginViewCreator(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
) {
  const createPreactPluginView = useCallback(
    (options: PreactPluginViewUserOptions): PluginViewSpec => {
      return (view) => {
        const pluginView = new PreactPluginView({
          view,
          options: {
            ...options,
            update: (view, prevState) => {
              options.update?.(view, prevState)
              renderPreactRenderer(pluginView)
            },
            destroy: () => {
              options.destroy?.()
              removePreactRenderer(pluginView)
            },
          },
        })

        renderPreactRenderer(pluginView, false)

        return pluginView
      }
    },
    [removePreactRenderer, renderPreactRenderer],
  )

  return createPreactPluginView
}

import { useCallback } from 'preact/hooks'

import type { PreactRendererResult } from '../PreactRenderer'

import { PreactWidgetView } from './PreactWidgetView'
import type { PreactWidgetViewSpec, PreactWidgetViewUserOptions } from './PreactWidgetViewOptions'

export function usePreactWidgetViewCreator(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
) {
  const createPreactWidgetView = useCallback(
    (options: PreactWidgetViewUserOptions): PreactWidgetViewSpec => {
      return {
        ...options,
        toDOM: (getPos, view) => {
          const widgetView = new PreactWidgetView({
            getPos,
            view,
            options: {
              ...options,
              destroy() {
                options.destroy?.()
                removePreactRenderer(widgetView)
              },
            },
          })

          renderPreactRenderer(widgetView, false)

          return widgetView.dom
        },
      } as PreactWidgetViewSpec
    },
    [removePreactRenderer, renderPreactRenderer],
  )

  return createPreactWidgetView
}

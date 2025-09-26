import type { WidgetDecorationFactory, WidgetDecorationSpec } from '@prosemirror-adapter/core'
import { Decoration } from 'prosemirror-view'
import { useCallback } from 'preact/hooks'

import type { PreactRendererResult } from '../PreactRenderer'

import { PreactWidgetView } from './PreactWidgetView'
import type { PreactWidgetViewUserOptions } from './PreactWidgetViewOptions'

export function usePreactWidgetViewCreator(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
) {
  const createWidgetPluginView = useCallback(
    (options: PreactWidgetViewUserOptions): WidgetDecorationFactory => {
      return (pos, userSpec = {}) => {
        const widgetView = new PreactWidgetView({
          pos,
          options,
        })
        const spec: WidgetDecorationSpec = {
          ...userSpec,
          destroy: (node) => {
            userSpec.destroy?.(node)
            removePreactRenderer(widgetView)
          },
        }
        widgetView.spec = spec

        return Decoration.widget(
          pos,
          (view, getPos) => {
            widgetView.bind(view, getPos)
            renderPreactRenderer(widgetView)

            return widgetView.dom
          },
          spec,
        )
      }
    },
    [removePreactRenderer, renderPreactRenderer],
  )

  return createWidgetPluginView
}

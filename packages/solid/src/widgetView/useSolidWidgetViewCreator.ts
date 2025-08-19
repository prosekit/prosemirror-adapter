import type {
  WidgetDecorationFactory,
  WidgetDecorationSpec,
} from '@prosemirror-adapter/core'
import { Decoration } from 'prosemirror-view'

import type { SolidRendererResult } from '../SolidRenderer'

import { SolidWidgetView } from './SolidWidgetView'
import type { SolidWidgetViewUserOptions } from './SolidWidgetViewOptions'

export function useSolidWidgetViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
) {
  const createWidgetPluginView = (
    options: SolidWidgetViewUserOptions,
  ): WidgetDecorationFactory => {
    return (pos, userSpec = {}) => {
      const widgetView = new SolidWidgetView({
        pos,
        options,
      })
      const spec: WidgetDecorationSpec = {
        ...userSpec,
        destroy: (node) => {
          userSpec.destroy?.(node)
          removeSolidRenderer(widgetView)
        },
      }
      widgetView.spec = spec

      return Decoration.widget(
        pos,
        (view, getPos) => {
          widgetView.bind(view, getPos)
          widgetView.updateContext()
          renderSolidRenderer(widgetView)

          return widgetView.dom
        },
        spec,
      )
    }
  }

  return createWidgetPluginView
}

import type { WidgetDecorationFactory, WidgetDecorationSpec } from '@prosemirror-adapter/core'
import { Decoration } from 'prosemirror-view'

import type { VueRendererResult } from '../VueRenderer'

import { VueWidgetView } from './VueWidgetView'
import type { VueWidgetViewUserOptions } from './VueWidgetViewOptions'

export function useVueWidgetViewCreator(renderVueRenderer: VueRendererResult['renderVueRenderer'], removeVueRenderer: VueRendererResult['removeVueRenderer']) {
  const createWidgetPluginView = (options: VueWidgetViewUserOptions): WidgetDecorationFactory => {
    return (pos, userSpec = {}) => {
      const widgetView = new VueWidgetView({
        pos,
        options,
      })
      const spec: WidgetDecorationSpec = {
        ...userSpec,
        destroy: (node) => {
          userSpec.destroy?.(node)
          removeVueRenderer(widgetView)
        },
      }
      widgetView.spec = spec

      return Decoration.widget(pos, (view, getPos) => {
        widgetView.bind(view, getPos)
        widgetView.updateContext()
        renderVueRenderer(widgetView)

        return widgetView.dom
      }, spec)
    }
  }

  return createWidgetPluginView
}

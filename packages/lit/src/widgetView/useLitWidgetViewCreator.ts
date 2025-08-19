import type { WidgetDecorationFactory, WidgetDecorationSpec } from '@prosemirror-adapter/core'
import { Decoration } from 'prosemirror-view'

import type { LitRendererResult } from '../LitRenderer'

import { LitWidgetView } from './LitWidgetView'
import type { LitWidgetViewUserOptions } from './LitWidgetViewOptions'

export function useLitWidgetViewCreator(renderLitRenderer: LitRendererResult['renderLitRenderer'], removeLitRenderer: LitRendererResult['removeLitRenderer']) {
  const createWidgetPluginView = (options: LitWidgetViewUserOptions): WidgetDecorationFactory => {
    return (pos, userSpec = {}) => {
      const widgetView = new LitWidgetView({
        pos,
        options,
      })
      const spec: WidgetDecorationSpec = {
        ...userSpec,
        destroy: (node) => {
          userSpec.destroy?.(node)
          removeLitRenderer(widgetView)
        },
      }
      widgetView.spec = spec

      return Decoration.widget(pos, (view, getPos) => {
        widgetView.bind(view, getPos)
        widgetView.updateContext()
        renderLitRenderer(widgetView)

        return widgetView.dom
      }, spec)
    }
  }

  return createWidgetPluginView
}

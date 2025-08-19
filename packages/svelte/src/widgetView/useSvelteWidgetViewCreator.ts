import type { WidgetDecorationFactory, WidgetDecorationSpec } from '@prosemirror-adapter/core'
import { Decoration } from 'prosemirror-view'

import type { SvelteRendererResult } from '../SvelteRenderer'

import { SvelteWidgetView } from './SvelteWidgetView'
import type { SvelteWidgetViewUserOptions } from './SvelteWidgetViewOptions'

export function useSvelteWidgetViewCreator(renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'], removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer']) {
  const createWidgetPluginView = (options: SvelteWidgetViewUserOptions): WidgetDecorationFactory => {
    return (pos, userSpec = {}) => {
      const widgetView = new SvelteWidgetView({
        pos,
        options,
      })
      const spec: WidgetDecorationSpec = {
        ...userSpec,
        destroy: (node) => {
          userSpec.destroy?.(node)
          removeSvelteRenderer(widgetView)
        },
      }
      widgetView.spec = spec

      return Decoration.widget(pos, (view, getPos) => {
        widgetView.bind(view, getPos)
        widgetView.updateContext()
        renderSvelteRenderer(widgetView)

        return widgetView.dom
      }, spec)
    }
  }

  return createWidgetPluginView
}

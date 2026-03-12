import type { VueRendererResult } from '../VueRenderer'

import type { MarkViewFactory } from './markViewContext'
import { VueMarkView } from './VueMarkView'

export function useVueMarkViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
) {
  const createVueMarkView: MarkViewFactory = (options) => (mark, view, inline) => {
    const nodeView = new VueMarkView({
      mark,
      view,
      inline,
      options: {
        ...options,
        destroy() {
          options.destroy?.()
          removeVueRenderer(nodeView)
        },
      },
    })
    renderVueRenderer(nodeView)

    return nodeView
  }

  return createVueMarkView
}

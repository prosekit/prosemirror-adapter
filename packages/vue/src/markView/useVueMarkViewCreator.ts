import type { VueRendererResult } from '../VueRenderer'

import type { MarkViewFactory } from './markViewContext'
import type { AbstractVueMarkView } from './VueMarkView'
import { VueMarkView } from './VueMarkView'

/**
 * @internal
 */
export function useAbstractVueMarkViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
  VueMarkViewClass: new (...args: ConstructorParameters<typeof AbstractVueMarkView>) => AbstractVueMarkView,
) {
  const createVueMarkView: MarkViewFactory = (options) => (mark, view, inline) => {
    const nodeView = new VueMarkViewClass({
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

export function useVueMarkViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
) {
  return useAbstractVueMarkViewCreator(renderVueRenderer, removeVueRenderer, VueMarkView)
}

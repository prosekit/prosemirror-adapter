import type { MarkViewConstructor } from 'prosemirror-view'

import type { VueRendererResult } from '../VueRenderer'

import type { AbstractVueMarkView } from './VueMarkView'
import { VueMarkView } from './VueMarkView'
import type { VueMarkViewUserOptions } from './VueMarkViewOptions'

/**
 * @internal
 */
export function buildVueMarkViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
  VueMarkViewClass: new (...args: ConstructorParameters<typeof AbstractVueMarkView>) => AbstractVueMarkView,
) {
  return function markViewCreator(options: VueMarkViewUserOptions): MarkViewConstructor {
    return function markViewConstructor(mark, view, inline) {
      const markView = new VueMarkViewClass({
        mark,
        view,
        inline,
        options: {
          ...options,
          destroy() {
            options.destroy?.()
            removeVueRenderer(markView)
          },
        },
      })
      renderVueRenderer(markView)

      return markView
    }
  }
}

export function useVueMarkViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
) {
  return buildVueMarkViewCreator(renderVueRenderer, removeVueRenderer, VueMarkView)
}

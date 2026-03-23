import type { MarkViewConstructor } from 'prosemirror-view'

import type { SolidRendererResult } from '../SolidRenderer'

import type { AbstractSolidMarkView } from './SolidMarkView'
import { SolidMarkView } from './SolidMarkView'
import type { SolidMarkViewUserOptions } from './SolidMarkViewOptions'

/**
 * @internal
 */
export function buildSolidMarkViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
  SolidMarkViewClass: new (...args: ConstructorParameters<typeof AbstractSolidMarkView>) => AbstractSolidMarkView,
) {
  return function markViewCreator(options: SolidMarkViewUserOptions): MarkViewConstructor {
    return function markViewConstructor(mark, view, inline) {
      const markView = new SolidMarkViewClass({
        mark,
        view,
        inline,
        options: {
          ...options,
          destroy() {
            options.destroy?.()
            removeSolidRenderer(markView)
          },
        },
      })

      renderSolidRenderer(markView, false)

      return markView
    }
  }
}

export function useSolidMarkViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
) {
  return buildSolidMarkViewCreator(renderSolidRenderer, removeSolidRenderer, SolidMarkView)
}

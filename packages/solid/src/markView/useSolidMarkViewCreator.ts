import type { MarkViewConstructor } from 'prosemirror-view'

import type { SolidRendererResult } from '../SolidRenderer'

import type { AbstractSolidMarkView } from './SolidMarkView'
import { SolidMarkView } from './SolidMarkView'
import type { SolidMarkViewUserOptions } from './SolidMarkViewOptions'

/**
 * @internal
 */
export function useAbstractSolidMarkViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
  SolidMarkViewClass: new (...args: ConstructorParameters<typeof AbstractSolidMarkView>) => AbstractSolidMarkView,
) {
  const createSolidMarkView =
    (options: SolidMarkViewUserOptions): MarkViewConstructor =>
    (mark, view, inline) => {
      const nodeView = new SolidMarkViewClass({
        mark,
        view,
        inline,
        options: {
          ...options,
          destroy() {
            options.destroy?.()
            removeSolidRenderer(nodeView)
          },
        },
      })

      renderSolidRenderer(nodeView, false)

      return nodeView
    }

  return createSolidMarkView
}

export function useSolidMarkViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
) {
  return useAbstractSolidMarkViewCreator(renderSolidRenderer, removeSolidRenderer, SolidMarkView)
}

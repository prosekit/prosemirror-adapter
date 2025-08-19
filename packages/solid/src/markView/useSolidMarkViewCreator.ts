import type { MarkViewConstructor } from 'prosemirror-view'

import type { SolidRendererResult } from '../SolidRenderer'

import { SolidMarkView } from './SolidMarkView'
import type { SolidMarkViewUserOptions } from './SolidMarkViewOptions'

export function useSolidMarkViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
) {
  const createSolidMarkView =
    (options: SolidMarkViewUserOptions): MarkViewConstructor =>
    (mark, view, inline) => {
      const nodeView = new SolidMarkView({
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

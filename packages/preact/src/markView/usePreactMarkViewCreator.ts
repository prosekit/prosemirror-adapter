import { useMemo } from 'preact/hooks'
import type { MarkViewConstructor } from 'prosemirror-view'

import type { PreactRendererResult } from '../PreactRenderer'

import type { AbstractPreactMarkView } from './PreactMarkView'
import { PreactMarkView } from './PreactMarkView'
import type { PreactMarkViewUserOptions } from './PreactMarkViewOptions'

/**
 * @internal
 */
export function buildPreactMarkViewCreator(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
  PreactMarkViewClass: new (...args: ConstructorParameters<typeof AbstractPreactMarkView>) => AbstractPreactMarkView,
) {
  return function markViewCreator(options: PreactMarkViewUserOptions): MarkViewConstructor {
    return function markViewConstructor(mark, view, inline) {
      const markView = new PreactMarkViewClass({
        mark,
        view,
        inline,
        options: {
          ...options,
          destroy() {
            options.destroy?.()
            removePreactRenderer(markView)
          },
        },
      })
      renderPreactRenderer(markView, false)

      return markView
    }
  }
}

export function usePreactMarkViewCreator(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
) {
  return useMemo(
    () => buildPreactMarkViewCreator(renderPreactRenderer, removePreactRenderer, PreactMarkView),
    [renderPreactRenderer, removePreactRenderer],
  )
}

import { useCallback } from 'preact/hooks'
import type { MarkViewConstructor } from 'prosemirror-view'

import type { PreactRendererResult } from '../PreactRenderer'

import { PreactMarkView } from './PreactMarkView'
import type { PreactMarkViewUserOptions } from './PreactMarkViewOptions'

export function usePreactMarkViewCreator(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
) {
  const createPreactMarkView = useCallback(
    (options: PreactMarkViewUserOptions): MarkViewConstructor =>
      (mark, view, inline) => {
        const markView = new PreactMarkView({
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
      },
    [removePreactRenderer, renderPreactRenderer],
  )

  return createPreactMarkView
}

import type { MarkViewConstructor } from 'prosemirror-view'
import { useCallback } from 'react'

import type { ReactRendererResult } from '../ReactRenderer'

import { ReactMarkView } from './ReactMarkView'
import type { ReactMarkViewUserOptions } from './ReactMarkViewOptions'

export function useReactMarkViewCreator(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
) {
  const createReactMarkView = useCallback(
    (options: ReactMarkViewUserOptions): MarkViewConstructor =>
      (mark, view, inline) => {
        const markView = new ReactMarkView({
          mark,
          view,
          inline,
          options: {
            ...options,
            destroy() {
              options.destroy?.()
              removeReactRenderer(markView)
            },
          },
        })
        renderReactRenderer(markView, false)

        return markView
      },
    [removeReactRenderer, renderReactRenderer],
  )

  return createReactMarkView
}

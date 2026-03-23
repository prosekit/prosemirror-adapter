import type { MarkViewConstructor } from 'prosemirror-view'
import { useMemo } from 'react'

import type { ReactRendererResult } from '../ReactRenderer'

import type { AbstractReactMarkView } from './ReactMarkView'
import { ReactMarkView } from './ReactMarkView'
import type { ReactMarkViewUserOptions } from './ReactMarkViewOptions'

/**
 * @internal
 */
export function buildReactMarkViewCreator(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
  ReactMarkViewClass: new (...args: ConstructorParameters<typeof AbstractReactMarkView>) => AbstractReactMarkView,
) {
  return function markViewCreator(options: ReactMarkViewUserOptions): MarkViewConstructor {
    return function markViewConstructor(mark, view, inline) {
      const markView = new ReactMarkViewClass({
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
    }
  }
}

export function useReactMarkViewCreator(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
) {
  return useMemo(
    () => buildReactMarkViewCreator(renderReactRenderer, removeReactRenderer, ReactMarkView),
    [renderReactRenderer, removeReactRenderer],
  )
}

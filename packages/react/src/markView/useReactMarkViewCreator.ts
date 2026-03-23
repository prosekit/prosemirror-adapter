import type { MarkViewConstructor } from 'prosemirror-view'
import { useCallback } from 'react'

import type { ReactRendererResult } from '../ReactRenderer'

import type { AbstractReactMarkView } from './ReactMarkView'
import { ReactMarkView } from './ReactMarkView'
import type { ReactMarkViewUserOptions } from './ReactMarkViewOptions'

/**
 * @internal
 */
export function useAbstractReactMarkViewCreator(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
  ReactMarkViewClass: new (...args: ConstructorParameters<typeof AbstractReactMarkView>) => AbstractReactMarkView,
) {
  const createReactMarkView = useCallback(
    (options: ReactMarkViewUserOptions): MarkViewConstructor =>
      (mark, view, inline) => {
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
      },
    [removeReactRenderer, renderReactRenderer, ReactMarkViewClass],
  )

  return createReactMarkView
}

export function useReactMarkViewCreator(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
) {
  return useAbstractReactMarkViewCreator(renderReactRenderer, removeReactRenderer, ReactMarkView)
}

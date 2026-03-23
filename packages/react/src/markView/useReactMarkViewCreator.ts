import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'
import type { MarkViewConstructor } from 'prosemirror-view'
import { useMemo } from 'react'

import type { ReactRendererResult } from '../ReactRenderer'

import type { AbstractReactMarkView } from './ReactMarkView'
import { ReactMarkView } from './ReactMarkView'

/**
 * @internal
 */
export function buildReactMarkViewCreator<ComponentType>(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
  ReactMarkViewClass: new (spec: CoreMarkViewSpec<ComponentType>) => AbstractReactMarkView<ComponentType>,
) {
  return function markViewCreator(userOptions: CoreMarkViewUserOptions<ComponentType>): MarkViewConstructor {
    return function markViewConstructor(mark, view, inline) {
      const patchedUserOptions: CoreMarkViewUserOptions<ComponentType> = {
        ...userOptions,
        destroy() {
          userOptions.destroy?.()
          removeReactRenderer(markView)
        },
      }
      const spec: CoreMarkViewSpec<ComponentType> = {
        mark,
        view,
        inline,
        options: patchedUserOptions,
      }
      const markView = new ReactMarkViewClass(spec)
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

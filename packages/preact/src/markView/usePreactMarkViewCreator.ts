import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'
import { useMemo } from 'preact/hooks'
import type { MarkViewConstructor } from 'prosemirror-view'

import type { PreactRendererResult } from '../PreactRenderer'

import type { AbstractPreactMarkView } from './PreactMarkView'
import { PreactMarkView } from './PreactMarkView'

/**
 * @internal
 */
export function buildPreactMarkViewCreator<ComponentType>(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
  PreactMarkViewClass: new (spec: CoreMarkViewSpec<ComponentType>) => AbstractPreactMarkView<ComponentType>,
) {
  return function markViewCreator(userOptions: CoreMarkViewUserOptions<ComponentType>): MarkViewConstructor {
    return function markViewConstructor(mark, view, inline) {
      const patchedUserOptions: CoreMarkViewUserOptions<ComponentType> = {
        ...userOptions,
        destroy() {
          userOptions.destroy?.()
          removePreactRenderer(markView)
        },
      }
      const spec: CoreMarkViewSpec<ComponentType> = {
        mark,
        view,
        inline,
        options: patchedUserOptions,
      }
      const markView = new PreactMarkViewClass(spec)
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

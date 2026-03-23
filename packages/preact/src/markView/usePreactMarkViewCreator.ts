import { useCallback } from 'preact/hooks'
import type { MarkViewConstructor } from 'prosemirror-view'

import type { PreactRendererResult } from '../PreactRenderer'

import type { AbstractPreactMarkView } from './PreactMarkView'
import { PreactMarkView } from './PreactMarkView'
import type { PreactMarkViewUserOptions } from './PreactMarkViewOptions'

/**
 * @internal
 */
export function useAbstractPreactMarkViewCreator(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
  PreactMarkViewClass: new (...args: ConstructorParameters<typeof AbstractPreactMarkView>) => AbstractPreactMarkView,
) {
  const createPreactMarkView = useCallback(
    (options: PreactMarkViewUserOptions): MarkViewConstructor =>
      (mark, view, inline) => {
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
      },
    [removePreactRenderer, renderPreactRenderer, PreactMarkViewClass],
  )

  return createPreactMarkView
}

export function usePreactMarkViewCreator(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
) {
  return useAbstractPreactMarkViewCreator(renderPreactRenderer, removePreactRenderer, PreactMarkView)
}

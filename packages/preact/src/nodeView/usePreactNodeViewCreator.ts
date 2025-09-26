import { useCallback } from 'preact/hooks'
import type { NodeViewConstructor } from 'prosemirror-view'

import type { PreactRendererResult } from '../PreactRenderer'

import { PreactNodeView } from './PreactNodeView'
import type { PreactNodeViewUserOptions } from './PreactNodeViewOptions'

export function usePreactNodeViewCreator(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
) {
  const createPreactNodeView = useCallback(
    (options: PreactNodeViewUserOptions): NodeViewConstructor =>
      (node, view, getPos, decorations, innerDecorations) => {
        const nodeView = new PreactNodeView({
          node,
          view,
          getPos,
          decorations,
          innerDecorations,
          options: {
            ...options,
            onUpdate() {
              options.onUpdate?.()
              renderPreactRenderer(nodeView)
            },
            selectNode() {
              options.selectNode?.()
              renderPreactRenderer(nodeView)
            },
            deselectNode() {
              options.deselectNode?.()
              renderPreactRenderer(nodeView)
            },
            destroy() {
              options.destroy?.()
              removePreactRenderer(nodeView)
            },
          },
        })

        renderPreactRenderer(nodeView, false)

        return nodeView
      },
    [removePreactRenderer, renderPreactRenderer],
  )

  return createPreactNodeView
}

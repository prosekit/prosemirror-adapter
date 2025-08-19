import type { NodeViewConstructor } from 'prosemirror-view'
import { useCallback } from 'react'

import type { ReactRendererResult } from '../ReactRenderer'

import { ReactNodeView } from './ReactNodeView'
import type { ReactNodeViewUserOptions } from './ReactNodeViewOptions'

export function useReactNodeViewCreator(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
) {
  const createReactNodeView = useCallback(
    (options: ReactNodeViewUserOptions): NodeViewConstructor =>
      (node, view, getPos, decorations, innerDecorations) => {
        const nodeView = new ReactNodeView({
          node,
          view,
          getPos,
          decorations,
          innerDecorations,
          options: {
            ...options,
            onUpdate() {
              options.onUpdate?.()
              renderReactRenderer(nodeView)
            },
            selectNode() {
              options.selectNode?.()
              renderReactRenderer(nodeView)
            },
            deselectNode() {
              options.deselectNode?.()
              renderReactRenderer(nodeView)
            },
            destroy() {
              options.destroy?.()
              removeReactRenderer(nodeView)
            },
          },
        })

        renderReactRenderer(nodeView, false)

        return nodeView
      },
    [removeReactRenderer, renderReactRenderer],
  )

  return createReactNodeView
}

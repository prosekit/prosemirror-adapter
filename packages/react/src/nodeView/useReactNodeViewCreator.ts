import type { NodeViewConstructor } from 'prosemirror-view'
import { useCallback } from 'react'

import type { ReactRendererResult } from '../ReactRenderer'

import type { AbstractReactNodeView } from './ReactNodeView'
import { ReactNodeView } from './ReactNodeView'
import type { ReactNodeViewUserOptions } from './ReactNodeViewOptions'

/**
 * @internal
 */
export function useAbstractReactNodeViewCreator(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
  ReactNodeViewClass: new (...args: ConstructorParameters<typeof AbstractReactNodeView>) => AbstractReactNodeView,
) {
  const createReactNodeView = useCallback(
    (options: ReactNodeViewUserOptions): NodeViewConstructor =>
      (node, view, getPos, decorations, innerDecorations) => {
        const nodeView = new ReactNodeViewClass({
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
    [removeReactRenderer, renderReactRenderer, ReactNodeViewClass],
  )

  return createReactNodeView
}

export function useReactNodeViewCreator(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
) {
  return useAbstractReactNodeViewCreator(renderReactRenderer, removeReactRenderer, ReactNodeView)
}

import type { NodeViewConstructor } from 'prosemirror-view'
import { useMemo } from 'react'

import type { ReactRendererResult } from '../ReactRenderer'

import type { AbstractReactNodeView } from './ReactNodeView'
import { ReactNodeView } from './ReactNodeView'
import type { ReactNodeViewUserOptions } from './ReactNodeViewOptions'

/**
 * @internal
 */
export function buildReactNodeViewCreator(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
  ReactNodeViewClass: new (...args: ConstructorParameters<typeof AbstractReactNodeView>) => AbstractReactNodeView,
) {
  return function nodeViewCreator(options: ReactNodeViewUserOptions): NodeViewConstructor {
    return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
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
    }
  }
}

export function useReactNodeViewCreator(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
) {
  return useMemo(
    () => buildReactNodeViewCreator(renderReactRenderer, removeReactRenderer, ReactNodeView),
    [renderReactRenderer, removeReactRenderer],
  )
}

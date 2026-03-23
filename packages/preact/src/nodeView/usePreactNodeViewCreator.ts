import { useMemo } from 'preact/hooks'
import type { NodeViewConstructor } from 'prosemirror-view'

import type { PreactRendererResult } from '../PreactRenderer'

import type { AbstractPreactNodeView } from './PreactNodeView'
import { PreactNodeView } from './PreactNodeView'
import type { PreactNodeViewUserOptions } from './PreactNodeViewOptions'

/**
 * @internal
 */
export function buildPreactNodeViewCreator(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
  PreactNodeViewClass: new (...args: ConstructorParameters<typeof AbstractPreactNodeView>) => AbstractPreactNodeView,
) {
  return function nodeViewCreator(options: PreactNodeViewUserOptions): NodeViewConstructor {
    return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
      const nodeView = new PreactNodeViewClass({
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
    }
  }
}

export function usePreactNodeViewCreator(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
) {
  return useMemo(
    () => buildPreactNodeViewCreator(renderPreactRenderer, removePreactRenderer, PreactNodeView),
    [renderPreactRenderer, removePreactRenderer],
  )
}

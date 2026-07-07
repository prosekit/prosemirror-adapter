import type { LitRendererResult } from '../LitRenderer'

import { LitNodeView } from './LitNodeView'
import type { NodeViewFactory } from './nodeViewContext'

export function useLitNodeViewCreator(
  renderLitRenderer: LitRendererResult['renderLitRenderer'],
  removeLitRenderer: LitRendererResult['removeLitRenderer'],
) {
  const createLitNodeView: NodeViewFactory = (options) => (node, view, getPos, decorations, innerDecorations) => {
    const nodeView = new LitNodeView({
      node,
      view,
      getPos,
      decorations,
      innerDecorations,
      options: {
        ...options,
        onUpdate() {
          options.onUpdate?.()
          nodeView.updateContext()
        },
        onSelectionChange() {
          options.onSelectionChange?.()
          nodeView.updateContext()
        },
        destroy() {
          options.destroy?.()
          removeLitRenderer(nodeView)
        },
      },
    })
    renderLitRenderer(nodeView)

    return nodeView
  }

  return createLitNodeView
}

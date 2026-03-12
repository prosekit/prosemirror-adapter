import type { VueRendererResult } from '../VueRenderer'

import type { NodeViewFactory } from './nodeViewContext'
import { VueNodeView } from './VueNodeView'

export function useVueNodeViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
) {
  const createVueNodeView: NodeViewFactory = (options) => (node, view, getPos, decorations, innerDecorations) => {
    const nodeView = new VueNodeView({
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
        selectNode() {
          options.selectNode?.()
          nodeView.updateContext()
        },
        deselectNode() {
          options.deselectNode?.()
          nodeView.updateContext()
        },
        destroy() {
          options.destroy?.()
          removeVueRenderer(nodeView)
        },
      },
    })
    renderVueRenderer(nodeView)

    return nodeView
  }

  return createVueNodeView
}

import { getAllContexts } from 'svelte'

import type { SvelteRendererResult } from '../SvelteRenderer'

import { SvelteNodeView } from './SvelteNodeView'
import type { NodeViewFactory } from './nodeViewContext'

export function useSvelteNodeViewCreator(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
) {
  const context = getAllContexts()

  const createSvelteNodeView: NodeViewFactory = (options) => (node, view, getPos, decorations, innerDecorations) => {
    const nodeView = new SvelteNodeView({
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
          removeSvelteRenderer(nodeView)
        },
      },
    })
    renderSvelteRenderer(nodeView, { context })

    return nodeView
  }

  return createSvelteNodeView
}

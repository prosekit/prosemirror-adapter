import type { VueRendererResult } from '../VueRenderer'

import type { NodeViewFactory } from './nodeViewContext'
import type { AbstractVueNodeView } from './VueNodeView'
import { VueNodeView } from './VueNodeView'

/**
 * @internal
 */
export function buildVueNodeViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
  VueNodeViewClass: new (...args: ConstructorParameters<typeof AbstractVueNodeView>) => AbstractVueNodeView,
) {
  const createVueNodeView: NodeViewFactory = (options) => (node, view, getPos, decorations, innerDecorations) => {
    const nodeView = new VueNodeViewClass({
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

export function useVueNodeViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
) {
  return buildVueNodeViewCreator(renderVueRenderer, removeVueRenderer, VueNodeView)
}

import type { NodeViewConstructor } from 'prosemirror-view'

import type { SolidRendererResult } from '../SolidRenderer'

import { SolidNodeView } from './SolidNodeView'
import type { SolidNodeViewUserOptions } from './SolidNodeViewOptions'

export function useSolidNodeViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
) {
  const createSolidNodeView =
    (options: SolidNodeViewUserOptions): NodeViewConstructor =>
    (node, view, getPos, decorations, innerDecorations) => {
      const nodeView = new SolidNodeView({
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
            removeSolidRenderer(nodeView)
          },
        },
      })

      renderSolidRenderer(nodeView, false)

      return nodeView
    }

  return createSolidNodeView
}

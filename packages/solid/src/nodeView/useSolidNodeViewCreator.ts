import type { NodeViewConstructor } from 'prosemirror-view'

import type { SolidRendererResult } from '../SolidRenderer'

import type { AbstractSolidNodeView } from './SolidNodeView'
import { SolidNodeView } from './SolidNodeView'
import type { SolidNodeViewUserOptions } from './SolidNodeViewOptions'

/**
 * @internal
 */
export function buildSolidNodeViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
  SolidNodeViewClass: new (...args: ConstructorParameters<typeof AbstractSolidNodeView>) => AbstractSolidNodeView,
) {
  const createSolidNodeView =
    (options: SolidNodeViewUserOptions): NodeViewConstructor =>
    (node, view, getPos, decorations, innerDecorations) => {
      const nodeView = new SolidNodeViewClass({
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

export function useSolidNodeViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
) {
  return buildSolidNodeViewCreator(renderSolidRenderer, removeSolidRenderer, SolidNodeView)
}

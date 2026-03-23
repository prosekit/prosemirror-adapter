import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'
import type { NodeViewConstructor } from 'prosemirror-view'

import type { SolidRendererResult } from '../SolidRenderer'

import type { AbstractSolidNodeView } from './SolidNodeView'
import { SolidNodeView } from './SolidNodeView'

/**
 * @internal
 */
export function buildSolidNodeViewCreator<ComponentType>(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
  SolidNodeViewClass: new (spec: CoreNodeViewSpec<ComponentType>) => AbstractSolidNodeView<ComponentType>,
) {
  return function nodeViewCreator(userOptions: CoreNodeViewUserOptions<ComponentType>): NodeViewConstructor {
    return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
      const patchedUserOptions: CoreNodeViewUserOptions<ComponentType> = {
        ...userOptions,
        onUpdate() {
          userOptions.onUpdate?.()
          nodeView.updateContext()
        },
        selectNode() {
          userOptions.selectNode?.()
          nodeView.updateContext()
        },
        deselectNode() {
          userOptions.deselectNode?.()
          nodeView.updateContext()
        },
        destroy() {
          userOptions.destroy?.()
          removeSolidRenderer(nodeView)
        },
      }
      const spec: CoreNodeViewSpec<ComponentType> = {
        node,
        view,
        getPos,
        decorations,
        innerDecorations,
        options: patchedUserOptions,
      }
      const nodeView = new SolidNodeViewClass(spec)
      renderSolidRenderer(nodeView, false)
      return nodeView
    }
  }
}

export function useSolidNodeViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
) {
  return buildSolidNodeViewCreator(renderSolidRenderer, removeSolidRenderer, SolidNodeView)
}

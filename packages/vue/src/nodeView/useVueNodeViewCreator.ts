import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'
import type { NodeViewConstructor } from 'prosemirror-view'

import type { VueRendererResult } from '../VueRenderer'

import type { AbstractVueNodeView } from './VueNodeView'
import { VueNodeView } from './VueNodeView'

/**
 * @internal
 */
export function buildVueNodeViewCreator<ComponentType>(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
  VueNodeViewClass: new (spec: CoreNodeViewSpec<ComponentType>) => AbstractVueNodeView<ComponentType>,
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
          removeVueRenderer(nodeView)
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
      const nodeView = new VueNodeViewClass(spec)
      renderVueRenderer(nodeView)
      return nodeView
    }
  }
}

export function useVueNodeViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
) {
  return buildVueNodeViewCreator(renderVueRenderer, removeVueRenderer, VueNodeView)
}

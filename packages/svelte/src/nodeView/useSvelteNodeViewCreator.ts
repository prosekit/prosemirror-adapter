import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'
import type { NodeViewConstructor } from 'prosemirror-view'
import { getAllContexts } from 'svelte'

import type { SvelteRendererResult } from '../SvelteRenderer'

import type { AbstractSvelteNodeView } from './SvelteNodeView'
import { SvelteNodeView } from './SvelteNodeView'

/**
 * @internal
 */
export function buildSvelteNodeViewCreator<ComponentType>(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
  SvelteNodeViewClass: new (spec: CoreNodeViewSpec<ComponentType>) => AbstractSvelteNodeView<ComponentType>,
  context: Map<any, any>,
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
          removeSvelteRenderer(nodeView)
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
      const nodeView = new SvelteNodeViewClass(spec)
      renderSvelteRenderer(nodeView, { context })
      return nodeView
    }
  }
}

export function useSvelteNodeViewCreator(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
) {
  const context = getAllContexts()
  return buildSvelteNodeViewCreator(renderSvelteRenderer, removeSvelteRenderer, SvelteNodeView, context)
}

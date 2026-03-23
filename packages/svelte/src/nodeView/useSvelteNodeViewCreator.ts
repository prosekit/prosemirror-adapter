import type { NodeViewConstructor } from 'prosemirror-view'
import { getAllContexts } from 'svelte'

import type { SvelteRendererResult } from '../SvelteRenderer'

import type { AbstractSvelteNodeView } from './SvelteNodeView'
import { SvelteNodeView } from './SvelteNodeView'
import type { SvelteNodeViewUserOptions } from './SvelteNodeViewOptions'

/**
 * @internal
 */
export function buildSvelteNodeViewCreator(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
  SvelteNodeViewClass: new (...args: ConstructorParameters<typeof AbstractSvelteNodeView>) => AbstractSvelteNodeView,
  context: Map<any, any>,
) {
  return function nodeViewCreator(options: SvelteNodeViewUserOptions): NodeViewConstructor {
    return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
      const nodeView = new SvelteNodeViewClass({
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
  }
}

export function useSvelteNodeViewCreator(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
) {
  const context = getAllContexts()
  return buildSvelteNodeViewCreator(renderSvelteRenderer, removeSvelteRenderer, SvelteNodeView, context)
}

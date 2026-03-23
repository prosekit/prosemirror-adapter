import type { NodeViewConstructor } from 'prosemirror-view'

import type { VueRendererResult } from '../VueRenderer'

import type { AbstractVueNodeView } from './VueNodeView'
import { VueNodeView } from './VueNodeView'
import type { VueNodeViewUserOptions } from './VueNodeViewOptions'

/**
 * @internal
 */
export function buildVueNodeViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
  VueNodeViewClass: new (...args: ConstructorParameters<typeof AbstractVueNodeView>) => AbstractVueNodeView,
) {
  return function nodeViewCreator(options: VueNodeViewUserOptions): NodeViewConstructor {
    return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
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
  }
}

export function useVueNodeViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
) {
  return buildVueNodeViewCreator(renderVueRenderer, removeVueRenderer, VueNodeView)
}

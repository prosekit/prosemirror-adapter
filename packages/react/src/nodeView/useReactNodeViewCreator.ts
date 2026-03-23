import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'
import type { NodeViewConstructor } from 'prosemirror-view'
import { useMemo } from 'react'

import type { ReactRendererResult } from '../ReactRenderer'

import type { AbstractReactNodeView } from './ReactNodeView'
import { ReactNodeView } from './ReactNodeView'

/**
 * @internal
 */
export function buildReactNodeViewCreator<ComponentType>(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
  ReactNodeViewClass: new (spec: CoreNodeViewSpec<ComponentType>) => AbstractReactNodeView<ComponentType>,
) {
  return function nodeViewCreator(userOptions: CoreNodeViewUserOptions<ComponentType>): NodeViewConstructor {
    return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
      const patchedUserOptions: CoreNodeViewUserOptions<ComponentType> = {
        ...userOptions,
        onUpdate() {
          userOptions.onUpdate?.()
          renderReactRenderer(nodeView)
        },
        selectNode() {
          userOptions.selectNode?.()
          renderReactRenderer(nodeView)
        },
        deselectNode() {
          userOptions.deselectNode?.()
          renderReactRenderer(nodeView)
        },
        destroy() {
          userOptions.destroy?.()
          removeReactRenderer(nodeView)
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
      const nodeView = new ReactNodeViewClass(spec)
      renderReactRenderer(nodeView, false)
      return nodeView
    }
  }
}

export function useReactNodeViewCreator(
  renderReactRenderer: ReactRendererResult['renderReactRenderer'],
  removeReactRenderer: ReactRendererResult['removeReactRenderer'],
) {
  return useMemo(
    () => buildReactNodeViewCreator(renderReactRenderer, removeReactRenderer, ReactNodeView),
    [renderReactRenderer, removeReactRenderer],
  )
}

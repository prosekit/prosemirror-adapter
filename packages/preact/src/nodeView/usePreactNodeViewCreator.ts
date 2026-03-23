import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'
import { useMemo } from 'preact/hooks'
import type { NodeViewConstructor } from 'prosemirror-view'

import type { PreactRendererResult } from '../PreactRenderer'

import type { AbstractPreactNodeView } from './PreactNodeView'
import { PreactNodeView } from './PreactNodeView'

/**
 * @internal
 */
export function buildPreactNodeViewCreator<ComponentType>(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
  PreactNodeViewClass: new (spec: CoreNodeViewSpec<ComponentType>) => AbstractPreactNodeView<ComponentType>,
) {
  return function nodeViewCreator(userOptions: CoreNodeViewUserOptions<ComponentType>): NodeViewConstructor {
    return function nodeViewConstructor(node, view, getPos, decorations, innerDecorations) {
      const patchedUserOptions: CoreNodeViewUserOptions<ComponentType> = {
        ...userOptions,
        onUpdate() {
          userOptions.onUpdate?.()
          renderPreactRenderer(nodeView)
        },
        selectNode() {
          userOptions.selectNode?.()
          renderPreactRenderer(nodeView)
        },
        deselectNode() {
          userOptions.deselectNode?.()
          renderPreactRenderer(nodeView)
        },
        destroy() {
          userOptions.destroy?.()
          removePreactRenderer(nodeView)
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
      const nodeView = new PreactNodeViewClass(spec)
      renderPreactRenderer(nodeView, false)
      return nodeView
    }
  }
}

export function usePreactNodeViewCreator(
  renderPreactRenderer: PreactRendererResult['renderPreactRenderer'],
  removePreactRenderer: PreactRendererResult['removePreactRenderer'],
) {
  return useMemo(
    () => buildPreactNodeViewCreator(renderPreactRenderer, removePreactRenderer, PreactNodeView),
    [renderPreactRenderer, removePreactRenderer],
  )
}

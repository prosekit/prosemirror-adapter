import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'
import type { MarkViewConstructor } from 'prosemirror-view'
import { getAllContexts } from 'svelte'

import type { SvelteRendererResult } from '../SvelteRenderer'

import type { AbstractSvelteMarkView } from './SvelteMarkView'
import { SvelteMarkView } from './SvelteMarkView'

/**
 * @internal
 */
export function buildSvelteMarkViewCreator<ComponentType>(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
  SvelteMarkViewClass: new (spec: CoreMarkViewSpec<ComponentType>) => AbstractSvelteMarkView<ComponentType>,
  context: Map<any, any>,
) {
  return function markViewCreator(userOptions: CoreMarkViewUserOptions<ComponentType>): MarkViewConstructor {
    return function markViewConstructor(mark, view, inline) {
      const patchedUserOptions: CoreMarkViewUserOptions<ComponentType> = {
        ...userOptions,
        destroy() {
          userOptions.destroy?.()
          removeSvelteRenderer(markView)
        },
      }
      const spec: CoreMarkViewSpec<ComponentType> = {
        mark,
        view,
        inline,
        options: patchedUserOptions,
      }
      const markView = new SvelteMarkViewClass(spec)
      renderSvelteRenderer(markView, { context })
      return markView
    }
  }
}

export function useSvelteMarkViewCreator(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
) {
  const context = getAllContexts()
  return buildSvelteMarkViewCreator(renderSvelteRenderer, removeSvelteRenderer, SvelteMarkView, context)
}

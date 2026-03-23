import type { MarkViewConstructor } from 'prosemirror-view'
import { getAllContexts } from 'svelte'

import type { SvelteRendererResult } from '../SvelteRenderer'

import type { AbstractSvelteMarkView } from './SvelteMarkView'
import { SvelteMarkView } from './SvelteMarkView'
import type { SvelteMarkViewUserOptions } from './SvelteMarkViewOptions'

/**
 * @internal
 */
export function buildSvelteMarkViewCreator(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
  SvelteMarkViewClass: new (...args: ConstructorParameters<typeof AbstractSvelteMarkView>) => AbstractSvelteMarkView,
  context: Map<any, any>,
) {
  return function markViewCreator(options: SvelteMarkViewUserOptions): MarkViewConstructor {
    return function markViewConstructor(mark, view, inline) {
      const markView = new SvelteMarkViewClass({
        mark,
        view,
        inline,
        options: {
          ...options,
          destroy() {
            options.destroy?.()
            removeSvelteRenderer(markView)
          },
        },
      })
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

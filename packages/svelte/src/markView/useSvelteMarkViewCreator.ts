import { getAllContexts } from 'svelte'

import type { SvelteRendererResult } from '../SvelteRenderer'

import type { MarkViewFactory } from './markViewContext'
import type { AbstractSvelteMarkView } from './SvelteMarkView'
import { SvelteMarkView } from './SvelteMarkView'

/**
 * @internal
 */
export function useAbstractSvelteMarkViewCreator(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
  SvelteMarkViewClass: new (...args: ConstructorParameters<typeof AbstractSvelteMarkView>) => AbstractSvelteMarkView,
) {
  const context = getAllContexts()

  const createSvelteMarkView: MarkViewFactory = (options) => (mark, view, inline) => {
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

  return createSvelteMarkView
}

export function useSvelteMarkViewCreator(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
) {
  return useAbstractSvelteMarkViewCreator(renderSvelteRenderer, removeSvelteRenderer, SvelteMarkView)
}

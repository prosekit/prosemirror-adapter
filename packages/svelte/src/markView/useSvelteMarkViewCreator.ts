import { getAllContexts } from 'svelte'

import type { SvelteRendererResult } from '../SvelteRenderer'

import { SvelteMarkView } from './SvelteMarkView'
import type { MarkViewFactory } from './markViewContext'

export function useSvelteMarkViewCreator(
  renderSvelteRenderer: SvelteRendererResult['renderSvelteRenderer'],
  removeSvelteRenderer: SvelteRendererResult['removeSvelteRenderer'],
) {
  const context = getAllContexts()

  const createSvelteMarkView: MarkViewFactory = (options) => (mark, view, inline) => {
    const markView = new SvelteMarkView({
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

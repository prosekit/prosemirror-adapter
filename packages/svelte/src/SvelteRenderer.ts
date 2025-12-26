import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'

import type { SvelteRenderOptions } from './types'

export interface SvelteRenderer<Context> {
  key: string

  context: Context

  render: (options: SvelteRenderOptions) => VoidFunction

  updateContext: () => void
}

export interface SvelteRendererResult {
  readonly renderSvelteRenderer: (renderer: SvelteRenderer<unknown>, options: SvelteRenderOptions) => void
  readonly removeSvelteRenderer: (renderer: SvelteRenderer<unknown>) => void
}

export function useSvelteRenderer(): SvelteRendererResult {
  const unmounts: Writable<Record<string, VoidFunction>> = writable({})

  const renderSvelteRenderer = (renderer: SvelteRenderer<unknown>, options: SvelteRenderOptions) => {
    unmounts.update((records) => ({
      ...records,
      [renderer.key]: renderer.render(options),
    }))
  }

  const removeSvelteRenderer = (renderer: SvelteRenderer<unknown>) => {
    unmounts.update((records) => {
      const { [renderer.key]: unmount, ...rest } = records
      unmount?.()
      return rest
    })
  }

  return {
    renderSvelteRenderer,
    removeSvelteRenderer,
  } as const
}

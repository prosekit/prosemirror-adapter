import type { Component } from 'svelte'

export type AnyRecord = Record<string, any>
export type SvelteComponentConstructor<T extends AnyRecord = any> = Component<T>

/**
 * @internal
 */
export interface SvelteRenderOptions {
  // The whole context map that belongs to the closest parent component.
  // Returned by `getAllContexts` from `svelte`.
  context: Map<unknown, unknown>
}

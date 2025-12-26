import type { Component, ComponentConstructorOptions, SvelteComponent } from 'svelte'

export type AnyRecord = Record<string, any>
export type SvelteClassComponentConstructor<T extends AnyRecord = any> = new (
  options: ComponentConstructorOptions<T>,
) => SvelteComponent
export type SvelteComponentConstructor<T extends AnyRecord = any> = SvelteClassComponentConstructor<T> | Component<T>

/**
 * @internal
 */
export interface SvelteRenderOptions {
  // The whole context map that belongs to the closest parent component.
  // Returned by `getAllContexts` from `svelte`.
  context: Map<unknown, unknown>
}

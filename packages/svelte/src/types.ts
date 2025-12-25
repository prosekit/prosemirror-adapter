import type { Component, ComponentConstructorOptions, SvelteComponent } from 'svelte'

export type AnyRecord = Record<string, any>
export type SvelteClassComponentConstructor<T extends AnyRecord = any> = new (
  options: ComponentConstructorOptions<T>,
) => SvelteComponent
export type SvelteComponentConstructor<T extends AnyRecord = any> = SvelteClassComponentConstructor<T> | Component<T>

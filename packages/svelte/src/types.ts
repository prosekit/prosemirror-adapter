import type { Component, ComponentConstructorOptions, SvelteComponent } from 'svelte'

export type AnyRecord = Record<string, any>
export type SvelteClassComponentConstructor<T extends AnyRecord = AnyRecord> = new (
  options: ComponentConstructorOptions<T>,
) => SvelteComponent
export type SvelteComponentConstructor<T extends AnyRecord = AnyRecord> =
  | SvelteClassComponentConstructor<T>
  | Component<T>

export type Obj2Map<T extends AnyRecord> = Map<keyof T, T[keyof T]>

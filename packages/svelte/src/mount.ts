import * as svelte from 'svelte'

import type { SvelteClassComponentConstructor, SvelteComponentConstructor } from './types'

const isSvelte5 = !!svelte.mount && !!svelte.flushSync

interface MountOptions {
  target: HTMLElement
  context: Map<string, unknown>
}

function mountFunctionComponent(UserComponent: SvelteComponentConstructor, options: MountOptions): VoidFunction {
  // Using Svelte v5, where components are functions
  const component = svelte.mount(UserComponent, { ...options }) as svelte.SvelteComponent
  // Unlike `new UserComponent()` in Svelte v4, `mount()` in Svelte v5 doesn't
  // call `onMount()` and action functions automatically. So we need to call
  // `flushSync()` to ensure they run.
  void svelte.tick()
  return () => svelte.unmount(component)
}

function mountClassComponent(UserComponent: SvelteComponentConstructor, options: MountOptions): VoidFunction {
  // Using Svelte v4, where components are classes
  const component = new (UserComponent as SvelteClassComponentConstructor)(options)
  return () => component.$destroy()
}

/**
 * Mounts a Svelte component to a DOM element.
 *
 * Returns a function that unmounts the component.
 */
export const mount = isSvelte5 ? mountFunctionComponent : mountClassComponent

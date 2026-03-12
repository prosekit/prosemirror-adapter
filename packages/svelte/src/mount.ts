import { flushSync, mount as svelteMount, unmount } from 'svelte'

import type { SvelteComponentConstructor } from './types'

interface MountOptions {
  target: HTMLElement
  context: Map<unknown, unknown>
}

/**
 * Mounts a Svelte component to a DOM element.
 *
 * Returns a function that unmounts the component.
 */
export function mount(UserComponent: SvelteComponentConstructor, options: MountOptions): VoidFunction {
  const component = svelteMount(UserComponent, { ...options })
  // `mount()` in Svelte v5 doesn't call `onMount()` and action functions
  // automatically. So we need to call `flushSync()` to ensure they run.
  flushSync()
  return () => unmount(component)
}

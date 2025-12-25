export function updateContextMap(
  /** The context map to update */
  current: Map<unknown, unknown>,

  /** Context from other parent Svelte components. Retrieved by `getAllContexts()` from `svelte` */
  allContext: Map<unknown, unknown>,

  /** Context required by prosemirror-adapter */
  prosemirrorAdapterContext: object,
) {
  const newContext = new Map<unknown, unknown>([
    ...allContext.entries(),

    // Put it last so that it can override if there are key conflicts.
    ...Object.entries(prosemirrorAdapterContext),
  ])

  for (const [key, oldValue] of current.entries()) {
    if (newContext.has(key)) {
      if (oldValue !== newContext.get(key)) {
        current.set(key, newContext.get(key))
      }
    } else {
      current.delete(key)
    }
  }

  for (const [key, newValue] of newContext.entries()) {
    if (!current.has(key)) {
      current.set(key, newValue)
    }
  }
}

export function updateContextMap(
  /** The context map to update */
  current: Map<unknown, unknown>,

  /** Context from other parent Svelte components. Retrieved by `getAllContexts()` from `svelte` */
  allContext: Map<unknown, unknown>,

  /** Context required by prosemirror-adapter */
  prosemirrorAdapterContext: object,
): void {
  const newContext = new Map<unknown, unknown>([
    ...allContext.entries(),

    // Put it last so that it can override if there are key conflicts.
    ...Object.entries(prosemirrorAdapterContext),
  ])

  const toDelete: unknown[] = []
  const toSet: [unknown, unknown][] = []

  for (const key of current.keys()) {
    if (!newContext.has(key)) {
      toDelete.push(key)
    }
  }

  for (const [key, newValue] of newContext.entries()) {
    if (!current.has(key) || current.get(key) !== newValue) {
      toSet.push([key, newValue])
    }
  }

  for (const key of toDelete) {
    current.delete(key)
  }
  for (const [key, value] of toSet) {
    current.set(key, value)
  }
}

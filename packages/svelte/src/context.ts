export function createContextMap(
  /**
   * Context from other parent Svelte components. Retrieved by `getAllContexts()` from `svelte` */
  allContext: Map<unknown, unknown>,

  /**
   * Context required by prosemirror-adapter
   */
  adapterContext: object,
): Map<unknown, unknown> {
  return new Map<unknown, unknown>([
    ...allContext.entries(),

    // Put it last so that it can override if there are key conflicts.
    ...Object.entries(adapterContext),
  ])
}

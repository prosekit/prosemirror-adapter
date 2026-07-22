import type { ViewMutationRecord } from 'prosemirror-view'

/**
 * Whether the mutation removed `contentDOM` from its parent element.
 *
 * The browser's native editing can cause this: when the selection covers all
 * of the contentDOM's text and the user types, Chrome and Safari delete the
 * whole contentDOM element and insert the typed text into its parent.
 * ProseMirror must see such a mutation, otherwise the view and the document
 * state diverge silently.
 */
export function isContentDOMRemoval(mutation: ViewMutationRecord, contentDOM: HTMLElement): boolean {
  if (mutation.type !== 'childList') return false

  for (const removedNode of mutation.removedNodes) {
    if (removedNode === contentDOM) return true
  }

  return false
}

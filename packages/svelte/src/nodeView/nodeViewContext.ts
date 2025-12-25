import type { Attrs, Node } from 'prosemirror-model'
import type { Decoration, DecorationSource, EditorView, NodeViewConstructor } from 'prosemirror-view'
import { getContext } from 'svelte'
import type { Writable } from 'svelte/store'

import type { SvelteNodeViewUserOptions } from './SvelteNodeViewOptions'

export interface NodeViewContext {
  // won't change
  contentRef: (element: HTMLElement | null) => void
  view: EditorView
  getPos: () => number | undefined
  setAttrs: (attrs: Attrs) => void

  // changes between updates
  node: Writable<Node>
  selected: Writable<boolean>
  decorations: Writable<readonly Decoration[]>
  innerDecorations: Writable<DecorationSource>
}

export function useNodeViewContext<Key extends keyof NodeViewContext>(key: Key): NodeViewContext[Key] {
  return getContext(key)
}

export const nodeViewFactoryKey = '[ProsemirrorAdapter]useNodeViewFactory'
export type NodeViewFactory = (options: SvelteNodeViewUserOptions) => NodeViewConstructor
export const useNodeViewFactory = () => getContext<NodeViewFactory>(nodeViewFactoryKey)

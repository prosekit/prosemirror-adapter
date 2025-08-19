import { ContextConsumer, createContext } from '@lit-labs/context'
import type { LitElement } from 'lit'
import type { RefOrCallback } from 'lit/directives/ref.js'
import type { Attrs, Node } from 'prosemirror-model'
import type { Decoration, DecorationSource, EditorView, NodeViewConstructor } from 'prosemirror-view'

import type { LitNodeViewUserOptions } from './LitNodeViewOptions'

export interface NodeViewContext {
  // won't change
  contentRef: RefOrCallback
  view: EditorView
  getPos: () => number | undefined
  setAttrs: (attrs: Attrs) => void

  // changes between updates
  node: Node
  selected: boolean
  decorations: readonly Decoration[]
  innerDecorations: DecorationSource
}

export const nodeViewContextKey = createContext<NodeViewContext>('[ProsemirrorAdapter]nodeViewContext')

export type ConsumeNodeViewContext = ContextConsumer<typeof nodeViewContextKey, LitElement>
export function useNodeViewContext(element: LitElement): ConsumeNodeViewContext {
  return new ContextConsumer(element, nodeViewContextKey, undefined, true)
}
export const nodeViewFactoryKey = createContext<NodeViewFactory>('[ProsemirrorAdapter]useNodeViewFactory')
export type NodeViewFactory = (options: LitNodeViewUserOptions) => NodeViewConstructor

export type ConsumeNodeViewFactory = ContextConsumer<typeof nodeViewFactoryKey, LitElement>
export function useNodeViewFactory(element: LitElement): ConsumeNodeViewFactory {
  return new ContextConsumer(element, nodeViewFactoryKey, undefined, true)
}

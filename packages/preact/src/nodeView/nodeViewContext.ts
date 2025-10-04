import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import type { Attrs, Node } from 'prosemirror-model'
import type { Decoration, DecorationSource, EditorView, NodeViewConstructor } from 'prosemirror-view'

import type { PreactNodeViewUserOptions } from './PreactNodeViewOptions'

export type NodeViewContentRef = (element: HTMLElement | null) => void

export interface NodeViewContext {
  // won't change
  contentRef: NodeViewContentRef
  view: EditorView
  getPos: () => number | undefined
  setAttrs: (attrs: Attrs) => void

  // changes between updates
  node: Node
  selected: boolean
  decorations: readonly Decoration[]
  innerDecorations: DecorationSource
}

export const nodeViewContext = createContext<NodeViewContext>({
  contentRef: () => {
    // nothing to do
  },
  view: null as never,
  getPos: () => 0,
  setAttrs: () => {
    // nothing to do
  },

  node: null as never,
  selected: false,
  decorations: [],
  innerDecorations: null as never,
})

export const useNodeViewContext = () => useContext(nodeViewContext)

export const createNodeViewContext = createContext<(options: PreactNodeViewUserOptions) => NodeViewConstructor>(
  (_options) => {
    throw new Error(
      'No ProsemirrorAdapterProvider detected, maybe you need to wrap the component with the Editor with ProsemirrorAdapterProvider?',
    )
  },
)

export const useNodeViewFactory = () => useContext(createNodeViewContext)
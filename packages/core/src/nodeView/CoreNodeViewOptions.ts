import type { Node } from 'prosemirror-model'
import type { Decoration, DecorationSource, EditorView, ViewMutationRecord } from 'prosemirror-view'

export type NodeViewDOMSpec = string | HTMLElement | ((node: Node) => HTMLElement)

export type NodeViewContentMountSource = 'contentRef' | 'component'

export interface CoreNodeViewUserOptions<Component> {
  // DOM
  as?: NodeViewDOMSpec
  contentAs?: NodeViewDOMSpec

  // Component
  component: Component

  // Overrides
  update?: (node: Node, decorations: readonly Decoration[], innerDecorations: DecorationSource) => boolean | void
  ignoreMutation?: (mutation: ViewMutationRecord) => boolean | void
  selectNode?: () => void
  deselectNode?: () => void
  setSelection?: (anchor: number, head: number, root: Document | ShadowRoot) => void
  stopEvent?: (event: Event) => boolean
  destroy?: () => void

  // Additional
  onUpdate?: () => void
}

export interface CoreNodeViewSpec<Component> {
  node: Node
  view: EditorView
  getPos: () => number | undefined
  decorations: readonly Decoration[]
  innerDecorations: DecorationSource

  options: CoreNodeViewUserOptions<Component>
}

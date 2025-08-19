import type { Attrs, Node } from 'prosemirror-model'
import type { Decoration, DecorationSource, EditorView, NodeView, ViewMutationRecord } from 'prosemirror-view'

import type { CoreNodeViewSpec, CoreNodeViewUserOptions, NodeViewDOMSpec } from './CoreNodeViewOptions'

export class CoreNodeView<ComponentType> implements NodeView {
  dom: HTMLElement
  contentDOM: HTMLElement | null
  node: Node
  view: EditorView
  getPos: () => number | undefined
  decorations: readonly Decoration[]
  innerDecorations: DecorationSource
  options: CoreNodeViewUserOptions<ComponentType>
  selected = false
  setSelection?: (anchor: number, head: number, root: Document | ShadowRoot) => void
  stopEvent?: (event: Event) => boolean

  #createElement(as?: NodeViewDOMSpec) {
    const { node } = this
    return as == null
      ? document.createElement(node.isInline ? 'span' : 'div')
      : as instanceof HTMLElement
        ? as
        : typeof as === 'function'
          ? as(node)
          : document.createElement(as)
  }

  createDOM(as?: NodeViewDOMSpec) {
    return this.#createElement(as)
  }

  createContentDOM(as?: NodeViewDOMSpec) {
    return this.#createElement(as)
  }

  constructor({ node, view, getPos, decorations, innerDecorations, options }: CoreNodeViewSpec<ComponentType>) {
    this.node = node
    this.view = view
    this.getPos = getPos
    this.decorations = decorations
    this.innerDecorations = innerDecorations
    this.options = options

    this.dom = this.createDOM(options.as)
    this.contentDOM = node.isLeaf ? null : this.createContentDOM(options.contentAs)
    this.dom.setAttribute('data-node-view-root', 'true')
    if (this.contentDOM) {
      this.contentDOM.setAttribute('data-node-view-content', 'true')
      this.contentDOM.style.whiteSpace = 'inherit'
    }

    this.setSelection = options.setSelection
    this.stopEvent = options.stopEvent
  }

  get component() {
    return this.options.component
  }

  selectNode = () => {
    this.selected = true
    this.options.selectNode?.()
  }

  deselectNode = () => {
    this.selected = false
    this.options.deselectNode?.()
  }

  shouldUpdate: (node: Node) => boolean = (node) => {
    if (node.type !== this.node.type) return false

    if (node.sameMarkup(this.node) && node.content.eq(this.node.content)) return false

    return true
  }

  update: (node: Node, decorations: readonly Decoration[], innerDecorations: DecorationSource) => boolean = (
    node,
    decorations,
    innerDecorations,
  ) => {
    const userUpdate = this.options.update
    let result
    if (userUpdate) result = userUpdate(node, decorations, innerDecorations)

    if (typeof result !== 'boolean') result = this.shouldUpdate(node)

    this.node = node
    this.decorations = decorations
    this.innerDecorations = innerDecorations

    if (result) this.options.onUpdate?.()

    return result
  }

  shouldIgnoreMutation: (mutation: ViewMutationRecord) => boolean = (mutation) => {
    if (!this.dom || !this.contentDOM) return true

    if (this.node.isLeaf || this.node.isAtom) return true

    if (mutation.type === 'selection') return false

    if (this.contentDOM === mutation.target && mutation.type === 'attributes') return true

    if (this.contentDOM.contains(mutation.target)) return false

    return true
  }

  ignoreMutation: (mutation: ViewMutationRecord) => boolean = (mutation) => {
    if (!this.dom || !this.contentDOM) return true

    let result

    const userIgnoreMutation = this.options.ignoreMutation

    if (userIgnoreMutation) result = userIgnoreMutation(mutation)

    if (typeof result !== 'boolean') result = this.shouldIgnoreMutation(mutation)

    return result
  }

  destroy: () => void = () => {
    this.options.destroy?.()
    this.dom.remove()
    this.contentDOM?.remove()
  }

  setAttrs = (attr: Attrs) => {
    const pos = this.getPos()

    if (typeof pos !== 'number') return

    return this.view.dispatch(
      this.view.state.tr.setNodeMarkup(pos, undefined, {
        ...this.node.attrs,
        ...attr,
      }),
    )
  }
}

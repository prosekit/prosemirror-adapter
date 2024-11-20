import type { Mark } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'

import type {
  CoreMarkViewSpec,
  CoreMarkViewUserOptions,
  MarkViewDOMSpec,
} from './CoreMarkViewOptions'

// TODO: Remove this definition and import MarkView from prosemirror-view once
// the PR below is released:
// https://github.com/ProseMirror/prosemirror-view/pull/174
interface MarkView {
  dom: Node
  contentDOM?: HTMLElement | null
  destroy?: () => void
  ignoreMutation?: (m: MutationRecord) => boolean
}

export class CoreMarkView<ComponentType> implements MarkView {
  dom: HTMLElement
  contentDOM: HTMLElement | undefined
  mark: Mark
  view: EditorView
  inline: boolean
  options: CoreMarkViewUserOptions<ComponentType>

  #createElement(as?: MarkViewDOMSpec) {
    const { inline, mark } = this
    return as == null
      ? document.createElement(inline ? 'span' : 'div')
      : as instanceof HTMLElement
        ? as
        : as instanceof Function
          ? as(mark)
          : document.createElement(as)
  }

  createDOM(as?: MarkViewDOMSpec) {
    return this.#createElement(as)
  }

  createContentDOM(as?: MarkViewDOMSpec) {
    return this.#createElement(as)
  }

  constructor({
    mark,
    view,
    inline,
    options,
  }: CoreMarkViewSpec<ComponentType>) {
    this.mark = mark
    this.view = view
    this.inline = inline
    this.options = options

    this.dom = this.createDOM(options.as)
    this.contentDOM = options.contentAs
      ? this.createContentDOM(options.contentAs)
      : undefined
    this.dom.setAttribute('data-mark-view-root', 'true')
    if (this.contentDOM) {
      this.contentDOM.setAttribute('data-mark-view-content', 'true')
      this.contentDOM.style.whiteSpace = 'inherit'
    }
  }

  get component() {
    return this.options.component
  }

  shouldIgnoreMutation: (mutation: MutationRecord) => boolean = (mutation) => {
    if (!this.dom || !this.contentDOM)
      return true

    // @ts-expect-error: TODO: I will fix this on the PM side.
    if (mutation.type === 'selection')
      return false

    if (this.contentDOM === mutation.target && mutation.type === 'attributes')
      return true

    if (this.contentDOM.contains(mutation.target))
      return false

    return true
  }

  ignoreMutation: (mutation: MutationRecord) => boolean = (mutation) => {
    if (!this.dom || !this.contentDOM)
      return true

    let result

    const userIgnoreMutation = this.options.ignoreMutation

    if (userIgnoreMutation)
      result = userIgnoreMutation(mutation)

    if (typeof result !== 'boolean')
      result = this.shouldIgnoreMutation(mutation)

    return result
  }

  destroy: () => void = () => {
    this.options.destroy?.()
    this.dom.remove()
    this.contentDOM?.remove()
  }
}

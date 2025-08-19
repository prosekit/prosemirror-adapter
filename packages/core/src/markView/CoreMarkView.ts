import type { Mark } from 'prosemirror-model'
import type { EditorView, MarkView, ViewMutationRecord } from 'prosemirror-view'

import type { CoreMarkViewSpec, CoreMarkViewUserOptions, MarkViewDOMSpec } from './CoreMarkViewOptions'

export class CoreMarkView<ComponentType> implements MarkView {
  dom: HTMLElement
  contentDOM: HTMLElement
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
        : typeof as === 'function'
          ? as(mark)
          : document.createElement(as)
  }

  createDOM(as?: MarkViewDOMSpec) {
    return this.#createElement(as)
  }

  createContentDOM(as?: MarkViewDOMSpec) {
    return this.#createElement(as)
  }

  constructor({ mark, view, inline, options }: CoreMarkViewSpec<ComponentType>) {
    this.mark = mark
    this.view = view
    this.inline = inline
    this.options = options

    this.dom = this.createDOM(options.as)
    this.contentDOM = this.createContentDOM(options.contentAs)
    this.dom.setAttribute('data-mark-view-root', 'true')
    this.contentDOM.setAttribute('data-mark-view-content', 'true')
    this.contentDOM.style.whiteSpace = 'inherit'
  }

  get component() {
    return this.options.component
  }

  shouldIgnoreMutation: (mutation: ViewMutationRecord) => boolean = (mutation) => {
    if (!this.dom || !this.contentDOM) return true

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
    this.contentDOM.remove()
  }
}

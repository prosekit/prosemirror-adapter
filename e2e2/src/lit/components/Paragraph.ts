import { ShallowLitElement, useNodeViewContext } from '@prosemirror-adapter/lit'
import { html, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'
import { ref } from 'lit/directives/ref.js'

@customElement('my-paragraph')
export class Paragraph extends ShallowLitElement {
  nodeViewContext = useNodeViewContext(this)

  override render() {
    const ctx = this.nodeViewContext.value
    if (!ctx) return
    const { contentRef, selected } = ctx
    return html`<div class="${selected ? 'selected' : nothing}" ${ref(contentRef)}></div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-paragraph': Paragraph
  }
}

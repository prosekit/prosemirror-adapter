import { ShallowLitElement, useNodeViewContext } from '@prosemirror-adapter/lit'
import { customElement } from 'lit/decorators.js'
import { ref } from 'lit/directives/ref.js'
import { html, unsafeStatic } from 'lit/static-html.js'

@customElement('my-heading')
export class Heading extends ShallowLitElement {
  nodeViewContext = useNodeViewContext(this)

  override render() {
    const contentRef = this.nodeViewContext.value?.contentRef
    const node = this.nodeViewContext.value?.node
    if (!contentRef || !node) return
    const tag = `h${node.attrs.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    return html`<${unsafeStatic(tag)} ${ref(contentRef)}></div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-heading': Heading
  }
}

import { ShallowLitElement, useNodeViewContext } from '@prosemirror-adapter/lit'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { ref } from 'lit/directives/ref.js'

@customElement('my-code-block')
export class CodeBlock extends ShallowLitElement {
  nodeViewContext = useNodeViewContext(this)

  override render() {
    const contentRef = this.nodeViewContext.value?.contentRef
    if (!contentRef) {
      return
    }

    return html`<pre ${ref(contentRef)}></pre>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-code-block': CodeBlock
  }
}

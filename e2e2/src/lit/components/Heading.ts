import { ShallowLitElement, useNodeViewContext } from '@prosemirror-adapter/lit'
import { customElement } from 'lit/decorators.js'
import { ref } from 'lit/directives/ref.js'
import { html } from 'lit/static-html.js'

@customElement('my-heading')
export class Heading extends ShallowLitElement {
  nodeViewContext = useNodeViewContext(this)

  override render() {
    const contentRef = this.nodeViewContext.value?.contentRef
    const node = this.nodeViewContext.value?.node
    const level = node?.attrs.level as number
    if (!contentRef || !node || ![1, 2, 3, 4, 5, 6].includes(level)) {
      return
    }

    switch (level) {
      case 1:
        return html`<h1 ${ref(contentRef)}></h1>`
      case 2:
        return html`<h2 ${ref(contentRef)}></h2>`
      case 3:
        return html`<h3 ${ref(contentRef)}></h3>`
      case 4:
        return html`<h4 ${ref(contentRef)}></h4>`
      case 5:
        return html`<h5 ${ref(contentRef)}></h5>`
      case 6:
        return html`<h6 ${ref(contentRef)}></h6>`
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-heading': Heading
  }
}

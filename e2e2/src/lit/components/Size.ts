import { ShallowLitElement, usePluginViewContext } from '@prosemirror-adapter/lit'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('my-size')
export class Size extends ShallowLitElement {
  pluginViewContext = usePluginViewContext(this)

  override render() {
    const size = this.pluginViewContext.value?.view.state.doc.nodeSize

    return html`<div data-test-id="size-view-plugin">Size for document: ${size}</div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-size': Size
  }
}

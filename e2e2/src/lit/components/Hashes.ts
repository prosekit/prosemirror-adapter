import { ShallowLitElement, useWidgetViewContext } from '@prosemirror-adapter/lit'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('my-hashes')
export class Hashes extends ShallowLitElement {
  widgetViewContext = useWidgetViewContext(this)

  override render() {
    const spec = this.widgetViewContext.value?.spec
    const level = (spec?.level as number) ?? 0
    const hashes = new Array(level).fill('#').join('')
    return html`<span class="hash">${hashes}</span>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-hashes': Hashes
  }
}

import { consume } from '@lit/context'
import { ShallowLitElement } from '@prosemirror-adapter/lit'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { extraContext } from './context'

@customElement('now-component')
export class Now extends ShallowLitElement {
  @consume({ context: extraContext, subscribe: true })
  @property({ attribute: false })
  now?: string

  override render() {
    return html`<div data-test-id="now-view-plugin">Now: ${this.now}</div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'now-component': Now
  }
}

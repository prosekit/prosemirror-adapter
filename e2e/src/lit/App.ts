import { provide } from '@lit/context'
import { ShallowLitElement } from '@prosemirror-adapter/lit'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { keyed } from 'lit/directives/keyed.js'

import { getNow } from '../shared/utils'

import './style.css'
import { extraContext } from './components/context'

export * from './components/Editor'
export { ProsemirrorAdapterProvider } from '@prosemirror-adapter/lit'

@customElement('test-app')
export class TestApp extends ShallowLitElement {
  @provide({ context: extraContext })
  now = ''

  @state()
  editorId = 0

  private intervalId?: ReturnType<typeof setInterval>

  override connectedCallback() {
    super.connectedCallback()
    this.intervalId = setInterval(() => {
      this.now = getNow()
    }, 1000)
  }

  override disconnectedCallback() {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId)
    }
    super.disconnectedCallback()
  }

  override render() {
    return html`
      <h1>Prosemirror Adapter Lit</h1>
      <button @click="${this._onClick}">rerender</button>
      ${keyed(
        this.editorId,
        html`
          <prosemirror-adapter-provider>
            <my-editor></my-editor>
          </prosemirror-adapter-provider>
        `,
      )}
    `
  }

  private _onClick = () => {
    this.editorId += 1
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'test-app': TestApp
  }
}

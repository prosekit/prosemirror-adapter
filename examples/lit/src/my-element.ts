import { ShallowLitElement } from '@prosemirror-adapter/lit'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { keyed } from 'lit/directives/keyed.js'

export * from './components/Editor'
export { ProsemirrorAdapterProvider } from '@prosemirror-adapter/lit'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends ShallowLitElement {
  @state()
  editorId = 0

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
    'my-element': MyElement
  }
}

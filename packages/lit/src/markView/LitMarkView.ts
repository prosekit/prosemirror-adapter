import type { Context } from '@lit-labs/context'
import { ContextProvider } from '@lit-labs/context'
import { CoreMarkView } from '@prosemirror-adapter/core'
import { customElement } from 'lit/decorators.js'
import { nanoid } from 'nanoid'

import type { LitRenderer } from '../LitRenderer'
import { ShallowLitElement } from '../utils'

import type { LitMarkViewComponent } from './LitMarkViewOptions'
import type { MarkViewContext } from './markViewContext'
import { markViewContextKey } from './markViewContext'

declare global {
  interface HTMLElementTagNameMap {
    'mark-view-dom-provider': MarkViewDOMProvider
  }
}

@customElement('mark-view-dom-provider')
export class MarkViewDOMProvider extends ShallowLitElement {
  markView!: LitMarkView

  provider!: ContextProvider<Context<typeof markViewContextKey, MarkViewContext>>

  override createRenderRoot() {
    return this
  }

  constructor(markView: LitMarkView) {
    super()
    if (!markView)
      return

    this.markView = markView
    this.provider = new ContextProvider(this, markViewContextKey, this.markView.context)
  }

  create = () => {
    this.markView.dom.appendChild(this)
    const UserComponent = this.markView.component
    const userComponent = new UserComponent()
    this.appendChild(userComponent)
    return userComponent
  }

  updateContext = () => {
    this.provider.setValue(this.markView.context)
  }
}

export class LitMarkView extends CoreMarkView<LitMarkViewComponent> implements LitRenderer<MarkViewContext> {
  key: string = nanoid()

  provider!: MarkViewDOMProvider

  context: MarkViewContext = {
    contentRef: (element) => {
      if (
        element
        && element instanceof HTMLElement
        && this.contentDOM
        && element.firstChild !== this.contentDOM
      ) {
        element.appendChild(this.contentDOM)
      }
    },
    view: this.view,
    mark: this.mark,
  }

  updateContext = () => {
    const next = {
      mark: this.mark,
    }
    this.context = {
      ...this.context,
      ...next,
    }
    this.provider?.updateContext()
  }

  render = () => {
    this.updateContext()
    this.provider = new MarkViewDOMProvider(this)
    return this.provider.create()
  }
}

import type { Context } from '@lit-labs/context'
import { ContextProvider } from '@lit-labs/context'
import { CoreWidgetView } from '@prosemirror-adapter/core'
import { customElement } from 'lit/decorators.js'
import { nanoid } from 'nanoid'

import type { LitRenderer } from '../LitRenderer'
import { ShallowLitElement } from '../utils'

import type { LitWidgetViewComponent } from './LitWidgetViewOptions'
import type { WidgetViewContext } from './widgetViewContext'
import { widgetViewContextKey } from './widgetViewContext'

declare global {
  interface HTMLElementTagNameMap {
    'widget-view-dom-provider': WidgetViewDOMProvider
  }
}

@customElement('widget-view-dom-provider')
export class WidgetViewDOMProvider extends ShallowLitElement {
  widgetView!: LitWidgetView

  provider!: ContextProvider<Context<typeof widgetViewContextKey, WidgetViewContext>>

  override createRenderRoot() {
    return this
  }

  constructor(widgetView: LitWidgetView) {
    super()
    if (!widgetView) return

    this.widgetView = widgetView
    this.provider = new ContextProvider(this, widgetViewContextKey, this.widgetView.context)
  }

  create = () => {
    this.widgetView.dom.appendChild(this)
    const UserComponent = this.widgetView.component
    const userComponent = new UserComponent()
    this.appendChild(userComponent)
    return userComponent
  }

  updateContext = () => {
    this.provider.setValue(this.widgetView.context)
  }
}

export class LitWidgetView extends CoreWidgetView<LitWidgetViewComponent> implements LitRenderer<WidgetViewContext> {
  key: string = nanoid()

  provider!: WidgetViewDOMProvider

  context: WidgetViewContext = {
    view: this.view!,
    getPos: this.getPos!,
    spec: this.spec,
  }

  updateContext = () => {
    const next: WidgetViewContext = {
      view: this.view!,
      getPos: this.getPos!,
      spec: this.spec,
    }
    this.context = {
      ...this.context,
      ...next,
    }
  }

  render = () => {
    this.updateContext()
    this.provider = new WidgetViewDOMProvider(this)
    return this.provider.create()
  }
}

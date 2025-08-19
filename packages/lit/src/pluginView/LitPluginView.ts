import type { Context } from '@lit-labs/context'
import { ContextProvider } from '@lit-labs/context'
import { CorePluginView } from '@prosemirror-adapter/core'
import { customElement } from 'lit/decorators.js'
import { nanoid } from 'nanoid'

import type { LitRenderer } from '../LitRenderer'
import { ShallowLitElement } from '../utils'

import type { LitPluginViewComponent } from './LitPluginViewOptions'
import type { PluginViewContext } from './pluginViewContext'
import { pluginViewContextKey } from './pluginViewContext'

declare global {
  interface HTMLElementTagNameMap {
    'plugin-view-dom-provider': PluginViewDOMProvider
  }
}

@customElement('plugin-view-dom-provider')
export class PluginViewDOMProvider extends ShallowLitElement {
  pluginView!: LitPluginView

  provider!: ContextProvider<Context<typeof pluginViewContextKey, PluginViewContext>>

  override createRenderRoot() {
    return this
  }

  constructor(pluginView: LitPluginView) {
    super()
    if (!pluginView) return

    this.pluginView = pluginView
    this.provider = new ContextProvider(this, pluginViewContextKey, this.pluginView.context)
  }

  create = () => {
    this.pluginView.root.appendChild(this)
    const UserComponent = this.pluginView.component
    const userComponent = new UserComponent()
    this.appendChild(userComponent)
    return userComponent
  }

  updateContext = () => {
    this.provider.setValue(this.pluginView.context)
  }
}

export class LitPluginView extends CorePluginView<LitPluginViewComponent> implements LitRenderer<PluginViewContext> {
  key: string = nanoid()

  provider!: PluginViewDOMProvider

  context: PluginViewContext = {
    view: this.view,
    prevState: this.prevState,
  }

  updateContext = () => {
    const next = {
      view: this.view,
      prevState: this.prevState,
    }
    this.context = {
      ...this.context,
      ...next,
    }
    this.provider?.updateContext()
  }

  render = () => {
    this.updateContext()
    this.provider = new PluginViewDOMProvider(this)
    return this.provider.create()
  }
}

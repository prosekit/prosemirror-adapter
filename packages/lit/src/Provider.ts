import { ContextProvider } from '@lit/context'
import { customElement } from 'lit/decorators.js'

import { useLitRenderer } from './LitRenderer'
import { markViewFactoryKey } from './markView'
import { useLitMarkViewCreator } from './markView/useLitMarkViewCreator'
import { nodeViewFactoryKey } from './nodeView'
import { useLitNodeViewCreator } from './nodeView/useLitNodeViewCreator'
import { pluginViewFactoryKey } from './pluginView'
import { useLitPluginViewCreator } from './pluginView/useLitPluginViewCreator'
import { ShallowLitElement } from './utils/ShallowLitElement'
import { widgetViewFactoryKey } from './widgetView'
import { useLitWidgetViewCreator } from './widgetView/useLitWidgetViewCreator'

@customElement('prosemirror-adapter-provider')
export class ProsemirrorAdapterProvider extends ShallowLitElement {
  declare createLitNodeView: ContextProvider<typeof nodeViewFactoryKey>
  declare createLitMarkView: ContextProvider<typeof markViewFactoryKey>
  declare createLitPluginView: ContextProvider<typeof pluginViewFactoryKey>
  declare createLitWidgetView: ContextProvider<typeof widgetViewFactoryKey>
  constructor() {
    super()
    const { renderLitRenderer, removeLitRenderer } = useLitRenderer()
    const createLitNodeView = useLitNodeViewCreator(renderLitRenderer, removeLitRenderer)
    const createLitMarkView = useLitMarkViewCreator(renderLitRenderer, removeLitRenderer)
    const createLitPluginView = useLitPluginViewCreator(renderLitRenderer, removeLitRenderer)
    const createLitWidgetView = useLitWidgetViewCreator(renderLitRenderer, removeLitRenderer)
    this.createLitNodeView = new ContextProvider(this, nodeViewFactoryKey, createLitNodeView)
    this.createLitMarkView = new ContextProvider(this, markViewFactoryKey, createLitMarkView)
    this.createLitPluginView = new ContextProvider(this, pluginViewFactoryKey, createLitPluginView)
    this.createLitWidgetView = new ContextProvider(this, widgetViewFactoryKey, createLitWidgetView)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'prosemirror-adapter-provider': ProsemirrorAdapterProvider
  }
}

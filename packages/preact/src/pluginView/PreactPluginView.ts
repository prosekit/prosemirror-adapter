import { CorePluginView } from '@prosemirror-adapter/core'
import { createElement } from 'preact'
import { createPortal } from 'preact/compat'

import type { PreactRenderer } from '../PreactRenderer'

import type { PluginViewContext } from './pluginViewContext'
import { pluginViewContext } from './pluginViewContext'
import type { PreactPluginViewComponent } from './PreactPluginViewOptions'

export class PreactPluginView
  extends CorePluginView<PreactPluginViewComponent>
  implements PreactRenderer<PluginViewContext>
{
  context: PluginViewContext = {
    view: this.view,
    prevState: this.prevState,
  }

  updateContext = () => {
    Object.assign(this.context, {
      view: this.view,
      prevState: this.prevState,
    })
  }

  render = () => {
    const UserComponent = this.component

    return createPortal(
      createElement(pluginViewContext.Provider, { value: this.context }, createElement(UserComponent, null)),
      this.root,
    )
  }
}

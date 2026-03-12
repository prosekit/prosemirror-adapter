import { CorePluginView } from '@prosemirror-adapter/core'
import { createElement } from 'react'
import { createPortal } from 'react-dom'

import type { ReactRenderer } from '../ReactRenderer'

import type { PluginViewContext } from './pluginViewContext'
import { pluginViewContext } from './pluginViewContext'
import type { ReactPluginViewComponent } from './ReactPluginViewOptions'

export class ReactPluginView
  extends CorePluginView<ReactPluginViewComponent>
  implements ReactRenderer<PluginViewContext>
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
      this.key,
    )
  }
}

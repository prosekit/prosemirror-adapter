import { CorePluginView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import { createPortal } from 'preact/compat'

import type { PreactRenderer } from '../PreactRenderer'

import type { PreactPluginViewComponent } from './PreactPluginViewOptions'
import type { PluginViewContext } from './pluginViewContext'
import { pluginViewContext } from './pluginViewContext'

export class PreactPluginView
  extends CorePluginView<PreactPluginViewComponent>
  implements PreactRenderer<PluginViewContext>
{
  key: string = nanoid()

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
      <pluginViewContext.Provider value={this.context}>
        <UserComponent />
      </pluginViewContext.Provider>,
      this.root,
    )
  }
}

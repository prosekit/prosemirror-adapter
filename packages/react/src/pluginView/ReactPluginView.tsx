import { CorePluginView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import React from 'react'
import { createPortal } from 'react-dom'

import type { ReactRenderer } from '../ReactRenderer'

import type { ReactPluginViewComponent } from './ReactPluginViewOptions'
import type { PluginViewContext } from './pluginViewContext'
import { pluginViewContext } from './pluginViewContext'

export class ReactPluginView extends CorePluginView<ReactPluginViewComponent> implements ReactRenderer<PluginViewContext> {
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
      this.key,
    )
  }
}

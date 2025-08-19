import { CoreWidgetView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import React from 'react'
import { createPortal } from 'react-dom'

import type { ReactRenderer } from '../ReactRenderer'

import type { ReactWidgetViewComponent } from './ReactWidgetViewOptions'
import type { WidgetViewContext } from './widgetViewContext'
import { widgetViewContext } from './widgetViewContext'

export class ReactWidgetView
  extends CoreWidgetView<ReactWidgetViewComponent>
  implements ReactRenderer<WidgetViewContext>
{
  key: string = nanoid()

  context: WidgetViewContext = {
    view: this.view!,
    getPos: this.getPos!,
    spec: this.spec,
  }

  updateContext = () => {
    Object.assign(this.context, {
      view: this.view,
      getPos: this.getPos,
      spec: this.spec,
    })
  }

  render = () => {
    const UserComponent = this.component

    return createPortal(
      <widgetViewContext.Provider value={this.context}>
        <UserComponent />
      </widgetViewContext.Provider>,
      this.dom,
      this.key,
    )
  }
}

import { CoreWidgetView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import { createPortal } from 'preact/compat'

import type { PreactRenderer } from '../PreactRenderer'

import type { PreactWidgetViewComponent } from './PreactWidgetViewOptions'
import type { WidgetViewContext } from './widgetViewContext'
import { widgetViewContext } from './widgetViewContext'

export class PreactWidgetView
  extends CoreWidgetView<PreactWidgetViewComponent>
  implements PreactRenderer<WidgetViewContext>
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
      <widgetViewContext.Provider value={this.context} key={this.key}>
        <UserComponent />
      </widgetViewContext.Provider>,
      this.dom,
    )
  }
}

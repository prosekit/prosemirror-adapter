import { CoreWidgetView } from '@prosemirror-adapter/core'
import { createElement } from 'preact'
import { createPortal } from 'preact/compat'

import type { PreactRenderer } from '../PreactRenderer'

import type { PreactWidgetViewComponent } from './PreactWidgetViewOptions'
import type { WidgetViewContext } from './widgetViewContext'
import { widgetViewContext } from './widgetViewContext'

export class PreactWidgetView
  extends CoreWidgetView<PreactWidgetViewComponent>
  implements PreactRenderer<WidgetViewContext>
{
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
      createElement(widgetViewContext.Provider, { value: this.context }, createElement(UserComponent, null)),
      this.dom,
    )
  }
}

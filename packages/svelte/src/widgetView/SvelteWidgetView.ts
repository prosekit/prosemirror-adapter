import { CoreWidgetView } from '@prosemirror-adapter/core'

import { createContextMap } from '../context'
import { mount } from '../mount'
import type { SvelteRenderer } from '../SvelteRenderer'
import type { SvelteRenderOptions } from '../types'

import type { SvelteWidgetViewComponent } from './SvelteWidgetViewOptions'
import type { WidgetViewContext } from './widgetViewContext'

export class SvelteWidgetView
  extends CoreWidgetView<SvelteWidgetViewComponent>
  implements SvelteRenderer<WidgetViewContext>
{
  context: WidgetViewContext = {
    view: this.view!,
    getPos: this.getPos!,
    spec: this.spec,
  }

  updateContext = () => {
    this.context.view = this.view!
    this.context.getPos = this.getPos!
    this.context.spec = this.spec
  }

  render = (options: SvelteRenderOptions) => {
    const UserComponent = this.component

    const context = createContextMap(options.context, this.context)

    return mount(UserComponent, {
      target: this.dom,
      context,
    })
  }
}

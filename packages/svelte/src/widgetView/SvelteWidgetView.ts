import { CoreWidgetView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'

import type { SvelteRenderer } from '../SvelteRenderer'
import { createContextMap } from '../context'
import { mount } from '../mount'
import type { SvelteRenderOptions } from '../types'

import type { SvelteWidgetViewComponent } from './SvelteWidgetViewOptions'
import type { WidgetViewContext } from './widgetViewContext'

export class SvelteWidgetView
  extends CoreWidgetView<SvelteWidgetViewComponent>
  implements SvelteRenderer<WidgetViewContext>
{
  key: string = nanoid()

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

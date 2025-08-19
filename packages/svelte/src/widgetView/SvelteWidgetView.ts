import { CoreWidgetView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'

import type { SvelteRenderer } from '../SvelteRenderer'
import { mount } from '../mount'

import type { SvelteWidgetViewComponent } from './SvelteWidgetViewOptions'
import type { WidgetViewContext, WidgetViewContextMap } from './widgetViewContext'


export class SvelteWidgetView extends CoreWidgetView<SvelteWidgetViewComponent> implements SvelteRenderer<WidgetViewContextMap> {
  key: string = nanoid()

  _context: WidgetViewContext = {
    view: this.view!,
    getPos: this.getPos!,
    spec: this.spec,
  }

  context: WidgetViewContextMap = new Map(Object.entries(this._context)) as WidgetViewContextMap

  updateContext = () => {
    const original = {
      view: this.view,
      getPos: this.getPos,
      spec: this.spec,
    }
    Object.entries(original).forEach(([key, value]) => {
      this.context.set(key as keyof typeof original, value)
    })
  }

  render = () => {
    const UserComponent = this.component

    return mount(UserComponent, {
      target: this.dom,
      context: this.context,
    })
  }
}

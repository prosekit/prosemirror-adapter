import { CoreMarkView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'

import type { SvelteRenderer } from '../SvelteRenderer'
import { mount } from '../mount'

import type { SvelteMarkViewComponent } from './SvelteMarkViewOptions'
import type { MarkViewContext, MarkViewContextMap } from './markViewContext'

export class SvelteMarkView
  extends CoreMarkView<SvelteMarkViewComponent>
  implements SvelteRenderer<MarkViewContextMap>
{
  key: string = nanoid()

  _context: MarkViewContext = {
    contentRef: (element) => {
      if (element && element instanceof HTMLElement && this.contentDOM && element.firstChild !== this.contentDOM) {
        element.appendChild(this.contentDOM)
      }
    },
    view: this.view,
    mark: writable(this.mark),
  }

  context: MarkViewContextMap = new Map(Object.entries(this._context)) as MarkViewContextMap

  updateContext = () => {
    const original = {
      mark: this.mark,
    }
    Object.entries(original).forEach(([key, value]) => {
      const mapKey = key as keyof typeof original
      const writable = this.context.get(mapKey) as Writable<(typeof original)[typeof mapKey]>
      writable.set(value)
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

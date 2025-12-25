import { CoreMarkView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import { writable } from 'svelte/store'

import type { SvelteRenderer } from '../SvelteRenderer'
import { mount } from '../mount'
import type { SvelteRenderOptions } from '../types'

import type { SvelteMarkViewComponent } from './SvelteMarkViewOptions'
import type { MarkViewContext } from './markViewContext'

export class SvelteMarkView extends CoreMarkView<SvelteMarkViewComponent> implements SvelteRenderer<MarkViewContext> {
  key: string = nanoid()

  context: MarkViewContext = {
    contentRef: (element) => {
      if (element && element instanceof HTMLElement && this.contentDOM && element.firstChild !== this.contentDOM) {
        element.appendChild(this.contentDOM)
      }
    },
    view: this.view,
    mark: writable(this.mark),
  }

  updateContext = () => {
    this.context.mark.set(this.mark)
  }

  render = (options: SvelteRenderOptions) => {
    const UserComponent = this.component

    const context = new Map<unknown, unknown>([
      // Context from other parent Svelte components
      ...options.context.entries(),
      // Context from prosemirror-adapter. Put it last so that it can override
      // if there are key conflicts.
      ...Object.entries(this.context),
    ])

    return mount(UserComponent, {
      target: this.dom,
      context: context,
    })
  }
}

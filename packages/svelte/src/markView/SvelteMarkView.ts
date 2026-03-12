import { CoreMarkView } from '@prosemirror-adapter/core'
import { writable } from 'svelte/store'

import { createContextMap } from '../context'
import { mount } from '../mount'
import type { SvelteRenderer } from '../SvelteRenderer'
import type { SvelteRenderOptions } from '../types'

import type { MarkViewContext } from './markViewContext'
import type { SvelteMarkViewComponent } from './SvelteMarkViewOptions'

/**
 * @internal
 */
export class SvelteHeadlessMarkView<ComponentType> extends CoreMarkView<ComponentType> {
  context: MarkViewContext = {
    contentRef: this.contentRef,
    view: this.view,
    mark: writable(this.mark),
  }

  updateContext = () => {
    this.context.mark.set(this.mark)
  }
}

export class SvelteMarkView
  extends SvelteHeadlessMarkView<SvelteMarkViewComponent>
  implements SvelteRenderer<MarkViewContext>
{
  render = (options: SvelteRenderOptions) => {
    const UserComponent = this.component

    const context = createContextMap(options.context, this.context)

    return mount(UserComponent, {
      target: this.dom,
      context,
    })
  }
}

import { CorePluginView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import { writable } from 'svelte/store'

import { createContextMap } from '../context'
import { mount } from '../mount'
import type { SvelteRenderer } from '../SvelteRenderer'
import type { SvelteRenderOptions } from '../types'

import type { PluginViewContext } from './pluginViewContext'
import type { SveltePluginViewComponent } from './SveltePluginViewOptions'

export class SveltePluginView
  extends CorePluginView<SveltePluginViewComponent>
  implements SvelteRenderer<PluginViewContext>
{
  key: string = nanoid()

  context: PluginViewContext = {
    view: writable(this.view),
    prevState: writable(this.prevState),
  }

  updateContext = () => {
    this.context.view.set(this.view)
    this.context.prevState.set(this.prevState)
  }

  render = (options: SvelteRenderOptions) => {
    const UserComponent = this.component

    const context = createContextMap(options.context, this.context)

    return mount(UserComponent, {
      target: this.root,
      context,
    })
  }
}

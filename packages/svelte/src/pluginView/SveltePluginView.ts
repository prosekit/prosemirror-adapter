import { CorePluginView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import { getAllContexts } from 'svelte'
import { writable } from 'svelte/store'

import type { SvelteRenderer } from '../SvelteRenderer'
import { mount } from '../mount'

import type { SveltePluginViewComponent } from './SveltePluginViewOptions'
import type { PluginViewContext } from './pluginViewContext'

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

  render = () => {
    const UserComponent = this.component

    const context = new Map([...getAllContexts().entries(), ...Object.entries(this.context)])

    return mount(UserComponent, {
      target: this.root,
      context: context,
    })
  }
}

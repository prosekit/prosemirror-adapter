import { CoreNodeView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import { getAllContexts } from 'svelte'
import { writable } from 'svelte/store'

import type { SvelteRenderer } from '../SvelteRenderer'
import { mount } from '../mount'

import type { SvelteNodeViewComponent } from './SvelteNodeViewOptions'
import type { NodeViewContext } from './nodeViewContext'

export class SvelteNodeView extends CoreNodeView<SvelteNodeViewComponent> implements SvelteRenderer<NodeViewContext> {
  key: string = nanoid()

  context: NodeViewContext = {
    contentRef: (element) => {
      if (element && element instanceof HTMLElement && this.contentDOM && element.firstChild !== this.contentDOM) {
        element.appendChild(this.contentDOM)
      }
    },
    view: this.view,
    getPos: this.getPos,
    setAttrs: this.setAttrs,

    node: writable(this.node),
    selected: writable(this.selected),
    decorations: writable(this.decorations),
    innerDecorations: writable(this.innerDecorations),
  }

  updateContext = () => {
    this.context.node.set(this.node)
    this.context.selected.set(this.selected)
    this.context.decorations.set(this.decorations)
    this.context.innerDecorations.set(this.innerDecorations)
  }

  render = () => {
    const UserComponent = this.component

    const context = new Map([...getAllContexts().entries(), ...Object.entries(this.context)])

    return mount(UserComponent, {
      target: this.dom,
      context: context,
    })
  }
}

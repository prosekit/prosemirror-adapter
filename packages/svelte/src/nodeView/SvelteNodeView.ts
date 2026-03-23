import { CoreNodeView } from '@prosemirror-adapter/core'
import { writable } from 'svelte/store'

import { createContextMap } from '../context'
import { mount } from '../mount'
import type { SvelteRenderer } from '../SvelteRenderer'
import type { SvelteRenderOptions } from '../types'

import type { NodeViewContext } from './nodeViewContext'
import type { SvelteNodeViewComponent } from './SvelteNodeViewOptions'

/**
 * @internal
 */
export abstract class AbstractSvelteNodeView
  extends CoreNodeView<SvelteNodeViewComponent>
  implements SvelteRenderer<NodeViewContext>
{
  context: NodeViewContext = {
    contentRef: this.contentRef,
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

  abstract render: (options: SvelteRenderOptions) => VoidFunction
}

export class SvelteNodeView extends AbstractSvelteNodeView implements SvelteRenderer<NodeViewContext> {
  render = (options: SvelteRenderOptions) => {
    const UserComponent = this.component

    const context = createContextMap(options.context, this.context)

    return mount(UserComponent, {
      target: this.dom,
      context,
    })
  }
}

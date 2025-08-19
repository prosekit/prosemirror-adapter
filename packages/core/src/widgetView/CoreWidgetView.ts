import type { EditorView } from 'prosemirror-view'

import type { CoreWidgetViewSpec, CoreWidgetViewUserOptions, WidgetDecorationSpec } from './CoreWidgetViewOptions'

export class CoreWidgetView<Component> {
  dom: HTMLElement
  pos: number
  view?: EditorView
  getPos?: () => number | undefined
  spec?: WidgetDecorationSpec

  options: CoreWidgetViewUserOptions<Component>

  #createElement(as: string | HTMLElement) {
    return as instanceof HTMLElement ? as : document.createElement(as)
  }

  constructor({ pos, spec, options }: CoreWidgetViewSpec<Component>) {
    this.pos = pos
    this.options = options
    this.spec = spec

    this.dom = this.#createElement(options.as)
    this.dom.setAttribute('data-widget-view-root', 'true')
  }

  bind(view: EditorView, getPos: () => number | undefined) {
    this.view = view
    this.getPos = getPos
  }

  get component() {
    return this.options.component
  }
}

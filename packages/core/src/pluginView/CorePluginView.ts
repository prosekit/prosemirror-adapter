import type { EditorState, PluginView } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

import type { CorePluginViewSpec, CorePluginViewUserOptions } from './CorePluginViewOptions'

export class CorePluginView<ComponentType> implements PluginView {
  view: EditorView
  prevState?: EditorState
  options: CorePluginViewUserOptions<ComponentType>

  constructor(spec: CorePluginViewSpec<ComponentType>) {
    this.view = spec.view
    this.options = spec.options
  }

  get component() {
    return this.options.component
  }

  get root() {
    let root = this.options.root?.(this.view.dom)

    if (!root)
      root = this.view.dom.parentElement ?? document.body

    return root
  }

  update(view: EditorView, prevState: EditorState) {
    this.view = view
    this.prevState = prevState
    this.options.update?.(view, prevState)
  }

  destroy(): void {
    this.options.destroy?.()
  }
}

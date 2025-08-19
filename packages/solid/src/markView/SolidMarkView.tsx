import { CoreMarkView, type CoreMarkViewSpec } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import type { Setter } from 'solid-js'
import { createSignal } from 'solid-js'
import { Dynamic, Portal } from 'solid-js/web'

import type { SolidRenderer } from '../SolidRenderer'
import { hidePortalDiv } from '../utils/hidePortalDiv'

import type { SolidMarkViewComponent } from './SolidMarkViewOptions'
import type { MarkViewContext, MarkViewContextProps } from './markViewContext'
import { markViewContext } from './markViewContext'

export class SolidMarkView extends CoreMarkView<SolidMarkViewComponent> implements SolidRenderer<MarkViewContext> {
  key: string = nanoid()
  context: MarkViewContext

  private setContext: Setter<MarkViewContextProps>

  constructor(spec: CoreMarkViewSpec<SolidMarkViewComponent>) {
    super(spec)
    const [context, setContext] = createSignal<MarkViewContextProps>({
      contentRef: (element) => {
        if (element && this.contentDOM && element.firstChild !== this.contentDOM) {
          element.appendChild(this.contentDOM)
        }
      },
      view: this.view,
      mark: this.mark,
    })

    this.context = context
    this.setContext = setContext
  }

  updateContext = () => {
    this.setContext((prev) => ({
      ...prev,
      mark: this.mark,
    }))
  }

  render = () => {
    const UserComponent = this.component

    return (
      <Portal mount={this.dom} ref={(el) => hidePortalDiv(el)}>
        <markViewContext.Provider value={this.context}>
          <Dynamic component={UserComponent} />
        </markViewContext.Provider>
      </Portal>
    )
  }
}

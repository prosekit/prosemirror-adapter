import { CoreMarkView, type CoreMarkViewSpec } from '@prosemirror-adapter/core'
import type { Setter } from 'solid-js'
import { createSignal } from 'solid-js'
import { Dynamic, Portal } from 'solid-js/web'

import type { SolidRenderer } from '../SolidRenderer'
import { hidePortalDiv } from '../utils/hidePortalDiv'

import type { MarkViewContext, MarkViewContextProps } from './markViewContext'
import { markViewContext } from './markViewContext'
import type { SolidMarkViewComponent } from './SolidMarkViewOptions'

/**
 * @internal
 */
export class SolidHeadlessMarkView<ComponentType> extends CoreMarkView<ComponentType> {
  context: MarkViewContext

  protected setContext: Setter<MarkViewContextProps>

  constructor(spec: CoreMarkViewSpec<ComponentType>) {
    super(spec)
    const [context, setContext] = createSignal<MarkViewContextProps>({
      contentRef: this.contentRef,
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
}

export class SolidMarkView
  extends SolidHeadlessMarkView<SolidMarkViewComponent>
  implements SolidRenderer<MarkViewContext>
{
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

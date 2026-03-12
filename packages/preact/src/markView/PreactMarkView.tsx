import { CoreMarkView } from '@prosemirror-adapter/core'
import { createPortal } from 'preact/compat'

import type { PreactRenderer } from '../PreactRenderer'

import type { MarkViewContext } from './markViewContext'
import { markViewContext } from './markViewContext'
import type { PreactMarkViewComponent } from './PreactMarkViewOptions'

/**
 * @internal
 */
export class PreactHeadlessMarkView<ComponentType> extends CoreMarkView<ComponentType> {
  context: MarkViewContext = {
    contentRef: this.contentRef,
    view: this.view,

    mark: this.mark,
  }

  updateContext = () => {
    Object.assign(this.context, {
      mark: this.mark,
    })
  }
}

export class PreactMarkView
  extends PreactHeadlessMarkView<PreactMarkViewComponent>
  implements PreactRenderer<MarkViewContext>
{
  render = () => {
    const UserComponent = this.component

    return createPortal(
      <markViewContext.Provider value={this.context}>
        <UserComponent />
      </markViewContext.Provider>,
      this.dom,
    )
  }
}

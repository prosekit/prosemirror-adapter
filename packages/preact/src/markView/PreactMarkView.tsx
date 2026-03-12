import { CoreMarkView } from '@prosemirror-adapter/core'
import { createPortal } from 'preact/compat'

import type { PreactRenderer } from '../PreactRenderer'

import type { MarkViewContext } from './markViewContext'
import { markViewContext } from './markViewContext'
import type { PreactMarkViewComponent } from './PreactMarkViewOptions'

export class PreactMarkView extends CoreMarkView<PreactMarkViewComponent> implements PreactRenderer<MarkViewContext> {
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

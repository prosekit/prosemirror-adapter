import { CoreMarkView } from '@prosemirror-adapter/core'
import { createPortal } from 'react-dom'

import type { ReactRenderer } from '../ReactRenderer'

import type { MarkViewContext } from './markViewContext'
import { markViewContext } from './markViewContext'
import type { ReactMarkViewComponent } from './ReactMarkViewOptions'

/**
 * @internal
 */
export class ReactHeadlessMarkView<ComponentType> extends CoreMarkView<ComponentType> {
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

export class ReactMarkView
  extends ReactHeadlessMarkView<ReactMarkViewComponent>
  implements ReactRenderer<MarkViewContext>
{
  render = () => {
    const UserComponent = this.component

    return createPortal(
      <markViewContext.Provider value={this.context}>
        <UserComponent />
      </markViewContext.Provider>,
      this.dom,
      this.key,
    )
  }
}

import { CoreMarkView } from '@prosemirror-adapter/core'
import type { VNode } from 'preact'
import { createElement } from 'preact'
import { createPortal } from 'preact/compat'

import type { PreactRenderer } from '../PreactRenderer'

import type { MarkViewContext } from './markViewContext'
import { markViewContext } from './markViewContext'
import type { PreactMarkViewComponent } from './PreactMarkViewOptions'

/**
 * @internal
 */
export abstract class AbstractPreactMarkView
  extends CoreMarkView<PreactMarkViewComponent>
  implements PreactRenderer<MarkViewContext>
{
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

  abstract render: () => VNode
}

export class PreactMarkView extends AbstractPreactMarkView implements PreactRenderer<MarkViewContext> {
  render = () => {
    const UserComponent = this.component

    return createPortal(
      createElement(markViewContext.Provider, { value: this.context }, createElement(UserComponent, null)),
      this.dom,
    )
  }
}

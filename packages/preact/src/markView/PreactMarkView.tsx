import { CoreMarkView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import { h } from 'preact'
import { createPortal } from 'preact/compat'

import type { PreactRenderer } from '../PreactRenderer'

import type { PreactMarkViewComponent } from './PreactMarkViewOptions'
import type { MarkViewContext } from './markViewContext'
import { markViewContext } from './markViewContext'

export class PreactMarkView extends CoreMarkView<PreactMarkViewComponent> implements PreactRenderer<MarkViewContext> {
  key: string = nanoid()

  context: MarkViewContext = {
    contentRef: (element) => {
      if (element && this.contentDOM && element.firstChild !== this.contentDOM) element.appendChild(this.contentDOM)
    },
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
      h(
        markViewContext.Provider,
        { value: this.context },
        h(UserComponent, {}),
      ),
      this.dom,
      this.key,
    )
  }
}
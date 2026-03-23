import { CoreMarkView } from '@prosemirror-adapter/core'
import type { ReactPortal } from 'react'
import { createElement } from 'react'
import { createPortal } from 'react-dom'

import type { ReactRenderer } from '../ReactRenderer'

import type { MarkViewContext } from './markViewContext'
import { markViewContext } from './markViewContext'
import type { ReactMarkViewComponent } from './ReactMarkViewOptions'

/**
 * @internal
 */
export abstract class AbstractReactMarkView<ComponentType>
  extends CoreMarkView<ComponentType>
  implements ReactRenderer<MarkViewContext>
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

  abstract render: () => ReactPortal
}

export class ReactMarkView
  extends AbstractReactMarkView<ReactMarkViewComponent>
  implements ReactRenderer<MarkViewContext>
{
  render = () => {
    const UserComponent = this.component

    return createPortal(
      createElement(markViewContext.Provider, { value: this.context }, createElement(UserComponent, null)),
      this.dom,
      this.key,
    )
  }
}

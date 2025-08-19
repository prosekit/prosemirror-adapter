import type { CoreWidgetViewSpec } from '@prosemirror-adapter/core'
import { CoreWidgetView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import type { JSX, Setter } from 'solid-js'
import { createSignal } from 'solid-js'
import { Dynamic, Portal } from 'solid-js/web'

import type { SolidRenderer } from '../SolidRenderer'
import { hidePortalDiv } from '../utils/hidePortalDiv'

import type { SolidWidgetViewComponent } from './SolidWidgetViewOptions'
import type {
  WidgetViewContext,
  WidgetViewContextProps,
} from './widgetViewContext'
import { widgetViewContext } from './widgetViewContext'

export class SolidWidgetView
  extends CoreWidgetView<SolidWidgetViewComponent>
  implements SolidRenderer<WidgetViewContext> {
  key: string = nanoid()

  context: WidgetViewContext

  private setContext: Setter<WidgetViewContextProps>

  constructor(spec: CoreWidgetViewSpec<SolidWidgetViewComponent>) {
    super(spec)
    const [context, setContext] = createSignal<WidgetViewContextProps>({
      view: this.view!,
      getPos: this.getPos!,
      spec: this.spec,
    })
    this.context = context
    this.setContext = setContext
  }

  updateContext = () => {
    this.setContext(() => ({
      view: this.view!,
      getPos: this.getPos!,
      spec: this.spec,
    }))
  }

  render = (): JSX.Element => {
    const UserComponent = this.component

    return (
      <Portal mount={this.dom} ref={el => hidePortalDiv(el)}>
        <widgetViewContext.Provider value={this.context}>
          <Dynamic component={UserComponent} />
        </widgetViewContext.Provider>
      </Portal>
    )
  }
}

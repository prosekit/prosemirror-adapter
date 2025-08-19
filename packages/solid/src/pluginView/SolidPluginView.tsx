import type { CorePluginViewSpec } from '@prosemirror-adapter/core'
import { CorePluginView } from '@prosemirror-adapter/core'
import { nanoid } from 'nanoid'
import type { JSX, Setter } from 'solid-js'
import { createSignal } from 'solid-js'
import { Dynamic, Portal } from 'solid-js/web'

import type { SolidRenderer } from '../SolidRenderer'
import { hidePortalDiv } from '../utils/hidePortalDiv'

import type { SolidPluginViewComponent } from './SolidPluginViewOptions'
import type {
  PluginViewContext,
  PluginViewContextProps,
} from './pluginViewContext'
import { pluginViewContext } from './pluginViewContext'

export class SolidPluginView
  extends CorePluginView<SolidPluginViewComponent>
  implements SolidRenderer<PluginViewContext> {
  key: string = nanoid()

  context: PluginViewContext

  private setContext: Setter<PluginViewContextProps>

  constructor(spec: CorePluginViewSpec<SolidPluginViewComponent>) {
    super(spec)
    const [context, setContext] = createSignal<PluginViewContextProps>({
      view: this.view,
      prevState: this.prevState,
    })
    this.context = context
    this.setContext = setContext
  }

  updateContext = () => {
    this.setContext(() => ({
      view: this.view,
      prevState: this.prevState,
    }))
  }

  render = (): JSX.Element => {
    const UserComponent = this.component

    return (
      <Portal mount={this.root} ref={el => hidePortalDiv(el)}>
        <pluginViewContext.Provider value={this.context}>
          <Dynamic component={UserComponent} />
        </pluginViewContext.Provider>
      </Portal>
    )
  }
}

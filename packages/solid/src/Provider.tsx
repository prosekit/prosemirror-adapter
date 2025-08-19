import { type Component, For, type ParentProps } from 'solid-js'

import { useSolidRenderer } from './SolidRenderer'
import { createMarkViewContext } from './markView'
import { useSolidMarkViewCreator } from './markView/useSolidMarkViewCreator'
import { createNodeViewContext } from './nodeView'
import { useSolidNodeViewCreator } from './nodeView/useSolidNodeViewCreator'
import { createPluginViewContext } from './pluginView'
import { useSolidPluginViewCreator } from './pluginView/useSolidPluginViewCreator'
import { createWidgetViewContext } from './widgetView'
import { useSolidWidgetViewCreator } from './widgetView/useSolidWidgetViewCreator'

export const ProsemirrorAdapterProvider: Component<ParentProps> = (props) => {
  const { renderSolidRenderer, removeSolidRenderer, portals }
    = useSolidRenderer()

  const createSolidNodeView = useSolidNodeViewCreator(
    renderSolidRenderer,
    removeSolidRenderer,
  )

  const createSolidMarkView = useSolidMarkViewCreator(
    renderSolidRenderer,
    removeSolidRenderer,
  )

  const createSolidWidgetView = useSolidWidgetViewCreator(
    renderSolidRenderer,
    removeSolidRenderer,
  )

  const createSolidPluginView = useSolidPluginViewCreator(
    renderSolidRenderer,
    removeSolidRenderer,
  )

  return (
    <createNodeViewContext.Provider value={createSolidNodeView}>
      <createMarkViewContext.Provider value={createSolidMarkView}>
        <createWidgetViewContext.Provider value={createSolidWidgetView}>
          <createPluginViewContext.Provider value={createSolidPluginView}>
            {props.children}
            <For each={Object.values(portals)}>{portal => portal}</For>
          </createPluginViewContext.Provider>
        </createWidgetViewContext.Provider>
      </createMarkViewContext.Provider>
    </createNodeViewContext.Provider>
  )
}

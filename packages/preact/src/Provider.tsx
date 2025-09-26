import type { ComponentChildren, FunctionalComponent } from 'preact'
import { useMemo } from 'preact/hooks'

import { usePreactRenderer } from './PreactRenderer'
import { createMarkViewContext } from './markView'
import { usePreactMarkViewCreator } from './markView/usePreactMarkViewCreator'
import { createNodeViewContext } from './nodeView'
import { usePreactNodeViewCreator } from './nodeView/usePreactNodeViewCreator'
import { createPluginViewContext } from './pluginView/pluginViewContext'
import { usePreactPluginViewCreator } from './pluginView/usePreactPluginViewCreator'
import { createWidgetViewContext } from './widgetView'
import { usePreactWidgetViewCreator } from './widgetView/usePreactWidgetViewCreator'

export interface ProsemirrorAdapterProviderProps {
  children?: ComponentChildren
}

export const ProsemirrorAdapterProvider: FunctionalComponent<ProsemirrorAdapterProviderProps> = ({ children }) => {
  const { renderPreactRenderer, removePreactRenderer, portals } = usePreactRenderer()

  const createPreactNodeView = usePreactNodeViewCreator(renderPreactRenderer, removePreactRenderer)

  const createPreactMarkView = usePreactMarkViewCreator(renderPreactRenderer, removePreactRenderer)

  const createPreactPluginView = usePreactPluginViewCreator(renderPreactRenderer, removePreactRenderer)

  const createPreactWidgetView = usePreactWidgetViewCreator(renderPreactRenderer, removePreactRenderer)

  const memoizedPortals = useMemo(() => Object.values(portals), [portals])

  return (
    <createNodeViewContext.Provider value={createPreactNodeView}>
      <createMarkViewContext.Provider value={createPreactMarkView}>
        <createPluginViewContext.Provider value={createPreactPluginView}>
          <createWidgetViewContext.Provider value={createPreactWidgetView}>
            {children}
            {memoizedPortals}
          </createWidgetViewContext.Provider>
        </createPluginViewContext.Provider>
      </createMarkViewContext.Provider>
    </createNodeViewContext.Provider>
  )
}

import { Fragment, type ComponentChildren, type FunctionalComponent } from 'preact'

import { createMarkViewContext } from './markView'
import { usePreactMarkViewCreator } from './markView/usePreactMarkViewCreator'
import { createNodeViewContext } from './nodeView'
import { usePreactNodeViewCreator } from './nodeView/usePreactNodeViewCreator'
import { createPluginViewContext } from './pluginView/pluginViewContext'
import { usePreactPluginViewCreator } from './pluginView/usePreactPluginViewCreator'
import { usePreactRenderer } from './PreactRenderer'
import { createWidgetViewContext } from './widgetView'
import { usePreactWidgetViewCreator } from './widgetView/usePreactWidgetViewCreator'

export type CreatePreactNodeView = ReturnType<typeof usePreactNodeViewCreator>
export type CreatePreactMarkView = ReturnType<typeof usePreactMarkViewCreator>
export type CreatePreactPluginView = ReturnType<typeof usePreactPluginViewCreator>
export type CreatePreactWidgetView = ReturnType<typeof usePreactWidgetViewCreator>

export const ProsemirrorAdapterProvider: FunctionalComponent<{ children: ComponentChildren }> = ({ children }) => {
  const { renderPreactRenderer, removePreactRenderer, portal } = usePreactRenderer()

  const createPreactNodeView: CreatePreactNodeView = usePreactNodeViewCreator(
    renderPreactRenderer,
    removePreactRenderer,
  )

  const createPreactMarkView: CreatePreactMarkView = usePreactMarkViewCreator(
    renderPreactRenderer,
    removePreactRenderer,
  )

  const createPreactPluginView: CreatePreactPluginView = usePreactPluginViewCreator(
    renderPreactRenderer,
    removePreactRenderer,
  )

  const createPreactWidgetView: CreatePreactWidgetView = usePreactWidgetViewCreator(
    renderPreactRenderer,
    removePreactRenderer,
  )

  return (
    <createNodeViewContext.Provider value={createPreactNodeView}>
      <createMarkViewContext.Provider value={createPreactMarkView}>
        <createPluginViewContext.Provider value={createPreactPluginView}>
          <createWidgetViewContext.Provider value={createPreactWidgetView}>
            <Fragment key={1}>{children}</Fragment>
            <Fragment key={2}>{portal}</Fragment>
          </createWidgetViewContext.Provider>
        </createPluginViewContext.Provider>
      </createMarkViewContext.Provider>
    </createNodeViewContext.Provider>
  )
}

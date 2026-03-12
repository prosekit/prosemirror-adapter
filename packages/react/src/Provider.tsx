import { Fragment, type FC, type ReactNode } from 'react'

import { createMarkViewContext } from './markView'
import { useReactMarkViewCreator } from './markView/useReactMarkViewCreator'
import { createNodeViewContext } from './nodeView'
import { useReactNodeViewCreator } from './nodeView/useReactNodeViewCreator'
import { createPluginViewContext } from './pluginView/pluginViewContext'
import { useReactPluginViewCreator } from './pluginView/useReactPluginViewCreator'
import { useReactRenderer } from './ReactRenderer'
import { createWidgetViewContext } from './widgetView'
import { useReactWidgetViewCreator } from './widgetView/useReactWidgetViewCreator'

export type CreateReactNodeView = ReturnType<typeof useReactNodeViewCreator>
export type CreateReactMarkView = ReturnType<typeof useReactMarkViewCreator>
export type CreateReactPluginView = ReturnType<typeof useReactPluginViewCreator>
export type CreateReactWidgetView = ReturnType<typeof useReactWidgetViewCreator>

export const ProsemirrorAdapterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { renderReactRenderer, removeReactRenderer, render } = useReactRenderer()

  const createReactNodeView: CreateReactNodeView = useReactNodeViewCreator(renderReactRenderer, removeReactRenderer)

  const createReactMarkView: CreateReactMarkView = useReactMarkViewCreator(renderReactRenderer, removeReactRenderer)

  const createReactPluginView: CreateReactPluginView = useReactPluginViewCreator(
    renderReactRenderer,
    removeReactRenderer,
  )

  const createReactWidgetView: CreateReactWidgetView = useReactWidgetViewCreator(
    renderReactRenderer,
    removeReactRenderer,
  )

  return (
    <createNodeViewContext.Provider value={createReactNodeView}>
      <createMarkViewContext.Provider value={createReactMarkView}>
        <createPluginViewContext.Provider value={createReactPluginView}>
          <createWidgetViewContext.Provider value={createReactWidgetView}>
            <Fragment key={1}>{children}</Fragment>
            <Fragment key={2}>{render()}</Fragment>
          </createWidgetViewContext.Provider>
        </createPluginViewContext.Provider>
      </createMarkViewContext.Provider>
    </createNodeViewContext.Provider>
  )
}

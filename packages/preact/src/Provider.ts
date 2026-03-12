import { Fragment, type ComponentChildren, type FunctionalComponent } from 'preact'
import { createElement } from 'preact'

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
  const { renderPreactRenderer, removePreactRenderer, render } = usePreactRenderer()

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

  return createElement(
    createNodeViewContext.Provider,
    { value: createPreactNodeView },
    createElement(
      createMarkViewContext.Provider,
      { value: createPreactMarkView },
      createElement(
        createPluginViewContext.Provider,
        { value: createPreactPluginView },
        createElement(
          createWidgetViewContext.Provider,
          { value: createPreactWidgetView },
          createElement(Fragment, { key: 1 }, children),
          createElement(Fragment, { key: 2 }, render()),
        ),
      ),
    ),
  )
}

import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import type { EditorView } from 'prosemirror-view'

import type { PreactWidgetViewSpec, PreactWidgetViewUserOptions } from './PreactWidgetViewOptions'

export interface WidgetViewContext {
  view: EditorView
  getPos: () => number | undefined
  spec?: PreactWidgetViewSpec
}

export const widgetViewContext = createContext<WidgetViewContext>({
  view: null as never,
  getPos: () => 0,
  spec: undefined,
})

export const useWidgetViewContext = () => useContext(widgetViewContext)

export const createWidgetViewContext = createContext<(options: PreactWidgetViewUserOptions) => PreactWidgetViewSpec>(
  (_options) => {
    throw new Error(
      'No ProsemirrorAdapterProvider detected, maybe you need to wrap the component with the Editor with ProsemirrorAdapterProvider?',
    )
  },
)

export const useWidgetViewFactory = () => useContext(createWidgetViewContext)
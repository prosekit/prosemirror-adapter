import type { WidgetDecorationFactory, WidgetDecorationSpec } from '@prosemirror-adapter/core'
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import type { EditorView } from 'prosemirror-view'

import type { PreactWidgetViewUserOptions } from './PreactWidgetViewOptions'

export interface WidgetViewContext {
  view: EditorView
  getPos: () => number | undefined
  spec?: WidgetDecorationSpec
}

export const widgetViewContext = createContext<WidgetViewContext>({
  view: null as never,
  getPos: () => undefined,
})

export const useWidgetViewContext = () => useContext(widgetViewContext)

export const createWidgetViewContext = createContext<(options: PreactWidgetViewUserOptions) => WidgetDecorationFactory>(
  (_options) => {
    throw new Error('out of scope')
  },
)

export const useWidgetViewFactory = () => useContext(createWidgetViewContext)

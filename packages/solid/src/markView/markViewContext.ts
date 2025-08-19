import type { Mark } from 'prosemirror-model'
import type { EditorView, MarkViewConstructor } from 'prosemirror-view'
import { type Accessor, createContext, useContext } from 'solid-js'

import type { SolidMarkViewUserOptions } from './SolidMarkViewOptions'

export type MarkViewContentRef = (element: HTMLElement | null) => void

export interface MarkViewContextProps {
  // won't change
  contentRef: MarkViewContentRef
  view: EditorView
  mark: Mark
}

export type MarkViewContext = Accessor<MarkViewContextProps>

export const markViewContext = createContext<MarkViewContext>(() => ({
  contentRef: () => {
    // nothing to do
  },
  view: null as never,
  mark: null as never,
}))

export const useMarkViewContext = () => useContext(markViewContext)

export const createMarkViewContext = createContext<(options: SolidMarkViewUserOptions) => MarkViewConstructor>(
  (_options) => {
    throw new Error(
      'No ProsemirrorAdapterProvider detected, maybe you need to wrap the component with the Editor with ProsemirrorAdapterProvider?',
    )
  },
)

export const useMarkViewFactory = () => useContext(createMarkViewContext)

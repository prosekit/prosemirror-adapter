import type { PluginViewSpec } from '@prosemirror-adapter/core'
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import type { EditorState } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

import type { PreactPluginViewUserOptions } from './PreactPluginViewOptions'

export interface PluginViewContext {
  view: EditorView
  prevState: EditorState | undefined
}

export const pluginViewContext = createContext<PluginViewContext>({
  view: null as never,
  prevState: null as never,
})

export const usePluginViewContext = () => useContext(pluginViewContext)

export const createPluginViewContext = createContext<(options: PreactPluginViewUserOptions) => PluginViewSpec>(
  (_options) => {
    throw new Error(
      'No ProsemirrorAdapterProvider detected, maybe you need to wrap the component with the Editor with ProsemirrorAdapterProvider?',
    )
  },
)

export const usePluginViewFactory = () => useContext(createPluginViewContext)

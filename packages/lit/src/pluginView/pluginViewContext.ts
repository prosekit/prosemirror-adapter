import { ContextConsumer, createContext } from '@lit-labs/context'
import type { PluginViewSpec } from '@prosemirror-adapter/core'
import type { LitElement } from 'lit'
import type { EditorState } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

import type { LitPluginViewUserOptions } from './LitPluginViewOptions'

export interface PluginViewContext {
  view: EditorView
  prevState: EditorState | undefined
}

export const pluginViewContextKey = createContext<PluginViewContext>('[ProsemirrorAdapter]nodeViewContext')
export type ConsumePluginViewContext = ContextConsumer<typeof pluginViewContextKey, LitElement>
export function usePluginViewContext(element: LitElement): ConsumePluginViewContext {
  return new ContextConsumer(element, pluginViewContextKey, undefined, true)
}

export type PluginViewFactory = (options: LitPluginViewUserOptions) => PluginViewSpec
export const pluginViewFactoryKey = createContext<PluginViewFactory>('[ProsemirrorAdapter]usePluginViewFactory')
export type ConsumePluginViewFactory = ContextConsumer<typeof pluginViewFactoryKey, LitElement>
export function usePluginViewFactory(element: LitElement): ConsumePluginViewFactory {
  return new ContextConsumer(element, pluginViewFactoryKey, undefined, true)
}

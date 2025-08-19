import type { PluginViewSpec } from '@prosemirror-adapter/core'
import type { EditorState } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import type { InjectionKey, ShallowRef } from 'vue'
import { inject } from 'vue'

import type { VuePluginViewUserOptions } from './VuePluginViewOptions'

export type PluginViewContentRef = (element: HTMLElement | null) => void

export interface PluginViewContext {
  view: ShallowRef<EditorView>
  prevState: ShallowRef<EditorState | undefined>
}

export const pluginViewContext: InjectionKey<Readonly<PluginViewContext>> = Symbol('[ProsemirrorAdapter]nodeViewContext')

export const usePluginViewContext = () => inject(pluginViewContext) as Readonly<PluginViewContext>

export type PluginViewFactory = (options: VuePluginViewUserOptions) => PluginViewSpec
export const pluginViewFactoryKey: InjectionKey<PluginViewFactory> = Symbol('[ProsemirrorAdapter]usePluginViewFactory')
export const usePluginViewFactory = () => inject(pluginViewFactoryKey) as PluginViewFactory

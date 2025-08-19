import type { PluginViewSpec } from '@prosemirror-adapter/core'
import type { EditorState } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import { getContext } from 'svelte'
import type { Writable } from 'svelte/store'

import type { Obj2Map } from '../types'

import type { SveltePluginViewUserOptions } from './SveltePluginViewOptions'

export type PluginViewContentRef = (element: HTMLElement | null) => void

export interface PluginViewContext {
  view: Writable<EditorView>
  prevState: Writable<EditorState | undefined>
}

export type PluginViewContextMap = Obj2Map<PluginViewContext>

export const usePluginViewContext = <Key extends keyof PluginViewContext>(key: Key): PluginViewContext[Key] => getContext(key)

export type PluginViewFactory = (options: SveltePluginViewUserOptions) => PluginViewSpec
export const pluginViewFactoryKey = '[ProsemirrorAdapter]usePluginViewFactory'
export const usePluginViewFactory = () => getContext<PluginViewFactory>(pluginViewFactoryKey)

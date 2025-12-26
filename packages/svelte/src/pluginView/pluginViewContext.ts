import type { PluginViewSpec } from '@prosemirror-adapter/core'
import type { EditorState } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import { getContext } from 'svelte'
import type { Writable } from 'svelte/store'

import type { SveltePluginViewUserOptions } from './SveltePluginViewOptions'

export type PluginViewContentRef = (element: HTMLElement | null) => void

export interface PluginViewContext {
  view: Writable<EditorView>
  prevState: Writable<EditorState | undefined>
}

export function usePluginViewContext<Key extends keyof PluginViewContext>(key: Key): PluginViewContext[Key] {
  return getContext(key)
}

export type PluginViewFactory = (options: SveltePluginViewUserOptions) => PluginViewSpec
export const pluginViewFactoryKey = '[ProsemirrorAdapter]usePluginViewFactory'
export const usePluginViewFactory = () => getContext<PluginViewFactory>(pluginViewFactoryKey)

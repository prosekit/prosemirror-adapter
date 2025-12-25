import type { WidgetDecorationFactory, WidgetDecorationSpec } from '@prosemirror-adapter/core'
import type { EditorView } from 'prosemirror-view'
import { getContext } from 'svelte'

import type { SvelteWidgetViewUserOptions } from './SvelteWidgetViewOptions'

export interface WidgetViewContext {
  view: EditorView
  getPos: () => number | undefined
  spec?: WidgetDecorationSpec
}

export function useWidgetViewContext<Key extends keyof WidgetViewContext>(key: Key): WidgetViewContext[Key] {
  return getContext(key)
}

export type WidgetViewFactory = (options: SvelteWidgetViewUserOptions) => WidgetDecorationFactory
export const widgetViewFactoryKey = '[ProsemirrorAdapter]useWidgetViewFactory'
export const useWidgetViewFactory = () => getContext<WidgetViewFactory>(widgetViewFactoryKey)

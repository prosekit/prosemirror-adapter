import type { WidgetDecorationFactory, WidgetDecorationSpec } from '@prosemirror-adapter/core'
import type { EditorView } from 'prosemirror-view'
import { getContext } from 'svelte'

import type { Obj2Map } from '../types'

import type { SvelteWidgetViewUserOptions } from './SvelteWidgetViewOptions'

export interface WidgetViewContext {
  view: EditorView
  getPos: () => number | undefined
  spec?: WidgetDecorationSpec
}

export type WidgetViewContextMap = Obj2Map<WidgetViewContext>

export const useWidgetViewContext = <Key extends keyof WidgetViewContext>(key: Key): WidgetViewContext[Key] => getContext(key)

export type WidgetViewFactory = (options: SvelteWidgetViewUserOptions) => WidgetDecorationFactory
export const widgetViewFactoryKey = '[ProsemirrorAdapter]useWidgetViewFactory'
export const useWidgetViewFactory = () => getContext<WidgetViewFactory>(widgetViewFactoryKey)

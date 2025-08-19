import type { WidgetDecorationFactory, WidgetDecorationSpec } from '@prosemirror-adapter/core'
import type { EditorView } from 'prosemirror-view'
import type { InjectionKey } from 'vue'
import { inject } from 'vue'

import type { VueWidgetViewUserOptions } from './VueWidgetViewOptions'

export interface WidgetViewContext {
  view: EditorView
  getPos: () => number | undefined
  spec?: WidgetDecorationSpec
}

export const widgetViewContext: InjectionKey<Readonly<WidgetViewContext>> = Symbol('[ProsemirrorAdapter]widgetViewContext')

export const useWidgetViewContext = () => inject(widgetViewContext) as Readonly<WidgetViewContext>

export type WidgetViewFactory = (options: VueWidgetViewUserOptions) => WidgetDecorationFactory
export const widgetViewFactoryKey: InjectionKey<WidgetViewFactory> = Symbol('[ProsemirrorAdapter]useWidgetViewFactory')
export const useWidgetViewFactory = () => inject(widgetViewFactoryKey) as WidgetViewFactory

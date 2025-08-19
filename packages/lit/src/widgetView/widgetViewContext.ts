import { ContextConsumer, createContext } from '@lit-labs/context'
import type { WidgetDecorationFactory, WidgetDecorationSpec } from '@prosemirror-adapter/core'
import type { LitElement } from 'lit'
import type { EditorView } from 'prosemirror-view'

import type { LitWidgetViewUserOptions } from './LitWidgetViewOptions'

export interface WidgetViewContext {
  view: EditorView
  getPos: () => number | undefined
  spec?: WidgetDecorationSpec
}

export const widgetViewContextKey = createContext<WidgetViewContext>('[ProsemirrorAdapter]widgetViewContext')
export type ConsumeWidgetViewContext = ContextConsumer<typeof widgetViewContextKey, LitElement>

export function useWidgetViewContext(element: LitElement): ConsumeWidgetViewContext {
  return new ContextConsumer(element, widgetViewContextKey, undefined, true)
}

export type WidgetViewFactory = (options: LitWidgetViewUserOptions) => WidgetDecorationFactory
export const widgetViewFactoryKey = createContext<WidgetViewFactory>('[ProsemirrorAdapter]useWidgetViewFactory')
export type ConsumeWidgetViewFactory = ContextConsumer<typeof widgetViewFactoryKey, LitElement>
export function useWidgetViewFactory(element: LitElement): ConsumeWidgetViewFactory {
  return new ContextConsumer(element, widgetViewFactoryKey, undefined, true)
}

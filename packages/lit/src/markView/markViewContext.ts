import { ContextConsumer, createContext } from '@lit-labs/context'
import type { LitElement } from 'lit'
import type { RefOrCallback } from 'lit/directives/ref.js'
import type { Mark } from 'prosemirror-model'
import type { EditorView, MarkViewConstructor } from 'prosemirror-view'

import type { LitMarkViewUserOptions } from './LitMarkViewOptions'

export interface MarkViewContext {
  // won't change
  contentRef: RefOrCallback
  view: EditorView
  mark: Mark
}

export const markViewContextKey = createContext<MarkViewContext>('[ProsemirrorAdapter]markViewContext')

export type ConsumeMarkViewContext = ContextConsumer<typeof markViewContextKey, LitElement>
export const useMarkViewContext = (element: LitElement): ConsumeMarkViewContext => new ContextConsumer(element, markViewContextKey, undefined, true)
export const markViewFactoryKey = createContext<MarkViewFactory>('[ProsemirrorAdapter]useMarkViewFactory')
export type MarkViewFactory = (options: LitMarkViewUserOptions) => MarkViewConstructor

export type ConsumeMarkViewFactory = ContextConsumer<typeof markViewFactoryKey, LitElement>
export const useMarkViewFactory = (element: LitElement): ConsumeMarkViewFactory => new ContextConsumer(element, markViewFactoryKey, undefined, true)

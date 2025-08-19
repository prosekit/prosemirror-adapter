import type { Mark } from 'prosemirror-model'
import type { EditorView, MarkViewConstructor } from 'prosemirror-view'
import type { InjectionKey, ShallowRef, VNodeRef } from 'vue'
import { inject } from 'vue'

import type { VueMarkViewUserOptions } from './VueMarkViewOptions'

export interface MarkViewContext {
  // won't change
  contentRef: VNodeRef
  view: EditorView
  mark: ShallowRef<Mark>
}

export const markViewContext: InjectionKey<Readonly<MarkViewContext>> = Symbol('[ProsemirrorAdapter]markViewContext')

export const useMarkViewContext = () => inject(markViewContext) as Readonly<MarkViewContext>

export type MarkViewFactory = (options: VueMarkViewUserOptions) => MarkViewConstructor
export const markViewFactoryKey: InjectionKey<MarkViewFactory> = Symbol('[ProsemirrorAdapter]useMarkViewFactory')
export const useMarkViewFactory = () => inject(markViewFactoryKey) as MarkViewFactory

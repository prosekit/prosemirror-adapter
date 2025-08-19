import type { Attrs, Node } from 'prosemirror-model'
import type { Decoration, DecorationSource, EditorView, NodeViewConstructor } from 'prosemirror-view'
import type { InjectionKey, ShallowRef, VNodeRef } from 'vue'
import { inject } from 'vue'

import type { VueNodeViewUserOptions } from './VueNodeViewOptions'

export interface NodeViewContext {
  // won't change
  contentRef: VNodeRef
  view: EditorView
  getPos: () => number | undefined
  setAttrs: (attrs: Attrs) => void

  // changes between updates
  node: ShallowRef<Node>
  selected: ShallowRef<boolean>
  decorations: ShallowRef<readonly Decoration[]>
  innerDecorations: ShallowRef<DecorationSource>
}

export const nodeViewContext: InjectionKey<Readonly<NodeViewContext>> = Symbol('[ProsemirrorAdapter]nodeViewContext')

export const useNodeViewContext = () => inject(nodeViewContext) as Readonly<NodeViewContext>

export type NodeViewFactory = (options: VueNodeViewUserOptions) => NodeViewConstructor
export const nodeViewFactoryKey: InjectionKey<NodeViewFactory> = Symbol('[ProsemirrorAdapter]useNodeViewFactory')
export const useNodeViewFactory = () => inject(nodeViewFactoryKey) as NodeViewFactory

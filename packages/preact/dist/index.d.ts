import * as preact from "preact";
import { ComponentChildren, ComponentType, FunctionalComponent, VNode } from "preact";
import { CoreMarkView, CoreMarkViewSpec, CoreMarkViewUserOptions, CoreNodeView, CoreNodeViewSpec, CoreNodeViewUserOptions, CorePluginView, CorePluginViewSpec, CorePluginViewUserOptions, CoreWidgetView, CoreWidgetViewSpec, CoreWidgetViewUserOptions, PluginViewSpec, WidgetDecorationFactory, WidgetDecorationSpec } from "@prosemirror-adapter/core";
import { Decoration, DecorationSource, EditorView, MarkViewConstructor, NodeViewConstructor } from "prosemirror-view";
import { Attrs, Mark, Node } from "prosemirror-model";
import { EditorState } from "prosemirror-state";

//#region src/markView/PreactMarkViewOptions.d.ts
type PreactMarkViewComponent = ComponentType<Record<string, never>>;
type PreactMarkViewSpec = CoreMarkViewSpec<PreactMarkViewComponent>;
type PreactMarkViewUserOptions = CoreMarkViewUserOptions<PreactMarkViewComponent>;
//#endregion
//#region src/markView/markViewContext.d.ts
type MarkViewContentRef = (element: HTMLElement | null) => void;
interface MarkViewContext {
  contentRef: MarkViewContentRef;
  view: EditorView;
  mark: Mark;
}
declare const markViewContext: preact.Context<MarkViewContext>;
declare const useMarkViewContext: () => MarkViewContext;
declare const createMarkViewContext: preact.Context<(options: PreactMarkViewUserOptions) => MarkViewConstructor>;
declare const useMarkViewFactory: () => (options: PreactMarkViewUserOptions) => MarkViewConstructor;
//#endregion
//#region src/PreactRenderer.d.ts
interface PreactRenderer<Context> {
  key: string;
  context: Context;
  render: () => VNode;
  updateContext: () => void;
}
interface PreactRendererResult {
  readonly portals: Record<string, VNode>;
  readonly renderPreactRenderer: (nodeView: PreactRenderer<unknown>, update?: boolean) => void;
  readonly removePreactRenderer: (nodeView: PreactRenderer<unknown>) => void;
}
//#endregion
//#region src/markView/PreactMarkView.d.ts
declare class PreactMarkView extends CoreMarkView<PreactMarkViewComponent> implements PreactRenderer<MarkViewContext> {
  key: string;
  context: MarkViewContext;
  updateContext: () => void;
  render: () => preact.VNode<any>;
}
//#endregion
//#region src/nodeView/PreactNodeViewOptions.d.ts
type PreactNodeViewComponent = ComponentType<Record<string, never>>;
type PreactNodeViewSpec = CoreNodeViewSpec<PreactNodeViewComponent>;
type PreactNodeViewUserOptions = CoreNodeViewUserOptions<PreactNodeViewComponent>;
//#endregion
//#region src/nodeView/nodeViewContext.d.ts
type NodeViewContentRef = (element: HTMLElement | null) => void;
interface NodeViewContext {
  contentRef: NodeViewContentRef;
  view: EditorView;
  getPos: () => number | undefined;
  setAttrs: (attrs: Attrs) => void;
  node: Node;
  selected: boolean;
  decorations: readonly Decoration[];
  innerDecorations: DecorationSource;
}
declare const nodeViewContext: preact.Context<NodeViewContext>;
declare const useNodeViewContext: () => NodeViewContext;
declare const createNodeViewContext: preact.Context<(options: PreactNodeViewUserOptions) => NodeViewConstructor>;
declare const useNodeViewFactory: () => (options: PreactNodeViewUserOptions) => NodeViewConstructor;
//#endregion
//#region src/nodeView/PreactNodeView.d.ts
declare class PreactNodeView extends CoreNodeView<PreactNodeViewComponent> implements PreactRenderer<NodeViewContext> {
  key: string;
  context: NodeViewContext;
  updateContext: () => void;
  render: () => preact.VNode<any>;
}
//#endregion
//#region src/pluginView/PreactPluginViewOptions.d.ts
type PreactPluginViewComponent = ComponentType<Record<string, never>>;
type PreactPluginViewSpec = CorePluginViewSpec<PreactPluginViewComponent>;
type PreactPluginViewUserOptions = CorePluginViewUserOptions<PreactPluginViewComponent>;
//#endregion
//#region src/pluginView/pluginViewContext.d.ts
type PluginViewContentRef = (element: HTMLElement | null) => void;
interface PluginViewContext {
  view: EditorView;
  prevState?: EditorState;
}
declare const pluginViewContext: preact.Context<PluginViewContext>;
declare const usePluginViewContext: () => PluginViewContext;
declare const createPluginViewContext: preact.Context<(options: PreactPluginViewUserOptions) => PluginViewSpec>;
declare const usePluginViewFactory: () => (options: PreactPluginViewUserOptions) => PluginViewSpec;
//#endregion
//#region src/pluginView/PreactPluginView.d.ts
declare class PreactPluginView extends CorePluginView<PreactPluginViewComponent> implements PreactRenderer<PluginViewContext> {
  key: string;
  context: PluginViewContext;
  updateContext: () => void;
  render: () => preact.VNode<any>;
}
//#endregion
//#region src/markView/usePreactMarkViewCreator.d.ts
declare function usePreactMarkViewCreator(renderPreactRenderer: PreactRendererResult['renderPreactRenderer'], removePreactRenderer: PreactRendererResult['removePreactRenderer']): (options: PreactMarkViewUserOptions) => MarkViewConstructor;
//#endregion
//#region src/nodeView/usePreactNodeViewCreator.d.ts
declare function usePreactNodeViewCreator(renderPreactRenderer: PreactRendererResult['renderPreactRenderer'], removePreactRenderer: PreactRendererResult['removePreactRenderer']): (options: PreactNodeViewUserOptions) => NodeViewConstructor;
//#endregion
//#region src/pluginView/usePreactPluginViewCreator.d.ts
declare function usePreactPluginViewCreator(renderPreactRenderer: PreactRendererResult['renderPreactRenderer'], removePreactRenderer: PreactRendererResult['removePreactRenderer']): (options: PreactPluginViewUserOptions) => PluginViewSpec;
//#endregion
//#region src/widgetView/PreactWidgetViewOptions.d.ts
type PreactWidgetViewComponent = ComponentType<Record<string, never>>;
type PreactWidgetViewSpec = CoreWidgetViewSpec<PreactWidgetViewComponent>;
type PreactWidgetViewUserOptions = CoreWidgetViewUserOptions<PreactWidgetViewComponent>;
//#endregion
//#region src/widgetView/usePreactWidgetViewCreator.d.ts
declare function usePreactWidgetViewCreator(renderPreactRenderer: PreactRendererResult['renderPreactRenderer'], removePreactRenderer: PreactRendererResult['removePreactRenderer']): (options: PreactWidgetViewUserOptions) => WidgetDecorationFactory;
//#endregion
//#region src/Provider.d.ts
type CreatePreactNodeView = ReturnType<typeof usePreactNodeViewCreator>;
type CreatePreactMarkView = ReturnType<typeof usePreactMarkViewCreator>;
type CreatePreactPluginView = ReturnType<typeof usePreactPluginViewCreator>;
type CreatePreactWidgetView = ReturnType<typeof usePreactWidgetViewCreator>;
declare const ProsemirrorAdapterProvider: FunctionalComponent<{
  children: ComponentChildren;
}>;
//#endregion
//#region src/widgetView/widgetViewContext.d.ts
interface WidgetViewContext {
  view: EditorView;
  getPos: () => number | undefined;
  spec?: WidgetDecorationSpec;
}
declare const widgetViewContext: preact.Context<WidgetViewContext>;
declare const useWidgetViewContext: () => WidgetViewContext;
declare const createWidgetViewContext: preact.Context<(options: PreactWidgetViewUserOptions) => WidgetDecorationFactory>;
declare const useWidgetViewFactory: () => (options: PreactWidgetViewUserOptions) => WidgetDecorationFactory;
//#endregion
//#region src/widgetView/PreactWidgetView.d.ts
declare class PreactWidgetView extends CoreWidgetView<PreactWidgetViewComponent> implements PreactRenderer<WidgetViewContext> {
  key: string;
  context: WidgetViewContext;
  updateContext: () => void;
  render: () => preact.VNode<any>;
}
//#endregion
export { type CreatePreactMarkView, type CreatePreactNodeView, type CreatePreactPluginView, type CreatePreactWidgetView, type MarkViewContentRef, type MarkViewContext, type NodeViewContentRef, type NodeViewContext, type PluginViewContentRef, type PluginViewContext, PreactMarkView, type PreactMarkViewComponent, type PreactMarkViewSpec, type PreactMarkViewUserOptions, PreactNodeView, type PreactNodeViewComponent, type PreactNodeViewSpec, type PreactNodeViewUserOptions, PreactPluginView, type PreactPluginViewComponent, type PreactPluginViewSpec, type PreactPluginViewUserOptions, PreactWidgetView, type PreactWidgetViewComponent, type PreactWidgetViewSpec, type PreactWidgetViewUserOptions, ProsemirrorAdapterProvider, type WidgetViewContext, createMarkViewContext, createNodeViewContext, createPluginViewContext, createWidgetViewContext, markViewContext, nodeViewContext, pluginViewContext, useMarkViewContext, useMarkViewFactory, useNodeViewContext, useNodeViewFactory, usePluginViewContext, usePluginViewFactory, useWidgetViewContext, useWidgetViewFactory, widgetViewContext };
//# sourceMappingURL=index.d.ts.map
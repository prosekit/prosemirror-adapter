import * as react from "react";
import { ComponentType, FC, ReactNode, ReactPortal } from "react";
import { CoreMarkView, CoreMarkViewSpec, CoreMarkViewUserOptions, CoreNodeView, CoreNodeViewSpec, CoreNodeViewUserOptions, CorePluginView, CorePluginViewSpec, CorePluginViewUserOptions, CoreWidgetView, CoreWidgetViewSpec, CoreWidgetViewUserOptions, PluginViewSpec, WidgetDecorationFactory, WidgetDecorationSpec } from "@prosemirror-adapter/core";
import { Decoration, DecorationSource, EditorView, MarkViewConstructor, NodeViewConstructor } from "prosemirror-view";
import { Attrs, Mark, Node } from "prosemirror-model";
import { EditorState } from "prosemirror-state";

//#region src/markView/ReactMarkViewOptions.d.ts
type ReactMarkViewComponent = ComponentType<Record<string, never>>;
type ReactMarkViewSpec = CoreMarkViewSpec<ReactMarkViewComponent>;
type ReactMarkViewUserOptions = CoreMarkViewUserOptions<ReactMarkViewComponent>;
//#endregion
//#region src/markView/markViewContext.d.ts
type MarkViewContentRef = (element: HTMLElement | null) => void;
interface MarkViewContext {
  contentRef: MarkViewContentRef;
  view: EditorView;
  mark: Mark;
}
declare const markViewContext: react.Context<MarkViewContext>;
declare const useMarkViewContext: () => MarkViewContext;
declare const createMarkViewContext: react.Context<(options: ReactMarkViewUserOptions) => MarkViewConstructor>;
declare const useMarkViewFactory: () => (options: ReactMarkViewUserOptions) => MarkViewConstructor;
//#endregion
//#region src/ReactRenderer.d.ts
interface ReactRenderer<Context> {
  key: string;
  context: Context;
  render: () => ReactPortal;
  updateContext: () => void;
}
interface ReactRendererResult {
  readonly portals: Record<string, ReactPortal>;
  readonly renderReactRenderer: (nodeView: ReactRenderer<unknown>, update?: boolean) => void;
  readonly removeReactRenderer: (nodeView: ReactRenderer<unknown>) => void;
}
//#endregion
//#region src/markView/ReactMarkView.d.ts
declare class ReactMarkView extends CoreMarkView<ReactMarkViewComponent> implements ReactRenderer<MarkViewContext> {
  key: string;
  context: MarkViewContext;
  updateContext: () => void;
  render: () => react.ReactPortal;
}
//#endregion
//#region src/nodeView/ReactNodeViewOptions.d.ts
type ReactNodeViewComponent = ComponentType<Record<string, never>>;
type ReactNodeViewSpec = CoreNodeViewSpec<ReactNodeViewComponent>;
type ReactNodeViewUserOptions = CoreNodeViewUserOptions<ReactNodeViewComponent>;
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
declare const nodeViewContext: react.Context<NodeViewContext>;
declare const useNodeViewContext: () => NodeViewContext;
declare const createNodeViewContext: react.Context<(options: ReactNodeViewUserOptions) => NodeViewConstructor>;
declare const useNodeViewFactory: () => (options: ReactNodeViewUserOptions) => NodeViewConstructor;
//#endregion
//#region src/nodeView/ReactNodeView.d.ts
declare class ReactNodeView extends CoreNodeView<ReactNodeViewComponent> implements ReactRenderer<NodeViewContext> {
  key: string;
  context: NodeViewContext;
  updateContext: () => void;
  render: () => react.ReactPortal;
}
//#endregion
//#region src/pluginView/ReactPluginViewOptions.d.ts
type ReactPluginViewComponent = ComponentType<Record<string, never>>;
type ReactPluginViewSpec = CorePluginViewSpec<ReactPluginViewComponent>;
type ReactPluginViewUserOptions = CorePluginViewUserOptions<ReactPluginViewComponent>;
//#endregion
//#region src/pluginView/pluginViewContext.d.ts
type PluginViewContentRef = (element: HTMLElement | null) => void;
interface PluginViewContext {
  view: EditorView;
  prevState?: EditorState;
}
declare const pluginViewContext: react.Context<PluginViewContext>;
declare const usePluginViewContext: () => PluginViewContext;
declare const createPluginViewContext: react.Context<(options: ReactPluginViewUserOptions) => PluginViewSpec>;
declare const usePluginViewFactory: () => (options: ReactPluginViewUserOptions) => PluginViewSpec;
//#endregion
//#region src/pluginView/ReactPluginView.d.ts
declare class ReactPluginView extends CorePluginView<ReactPluginViewComponent> implements ReactRenderer<PluginViewContext> {
  key: string;
  context: PluginViewContext;
  updateContext: () => void;
  render: () => react.ReactPortal;
}
//#endregion
//#region src/markView/useReactMarkViewCreator.d.ts
declare function useReactMarkViewCreator(renderReactRenderer: ReactRendererResult['renderReactRenderer'], removeReactRenderer: ReactRendererResult['removeReactRenderer']): (options: ReactMarkViewUserOptions) => MarkViewConstructor;
//#endregion
//#region src/nodeView/useReactNodeViewCreator.d.ts
declare function useReactNodeViewCreator(renderReactRenderer: ReactRendererResult['renderReactRenderer'], removeReactRenderer: ReactRendererResult['removeReactRenderer']): (options: ReactNodeViewUserOptions) => NodeViewConstructor;
//#endregion
//#region src/pluginView/useReactPluginViewCreator.d.ts
declare function useReactPluginViewCreator(renderReactRenderer: ReactRendererResult['renderReactRenderer'], removeReactRenderer: ReactRendererResult['removeReactRenderer']): (options: ReactPluginViewUserOptions) => PluginViewSpec;
//#endregion
//#region src/widgetView/ReactWidgetViewOptions.d.ts
type ReactWidgetViewComponent = ComponentType<Record<string, never>>;
type ReactWidgetViewSpec = CoreWidgetViewSpec<ReactWidgetViewComponent>;
type ReactWidgetViewUserOptions = CoreWidgetViewUserOptions<ReactWidgetViewComponent>;
//#endregion
//#region src/widgetView/useReactWidgetViewCreator.d.ts
declare function useReactWidgetViewCreator(renderReactRenderer: ReactRendererResult['renderReactRenderer'], removeReactRenderer: ReactRendererResult['removeReactRenderer']): (options: ReactWidgetViewUserOptions) => WidgetDecorationFactory;
//#endregion
//#region src/Provider.d.ts
type CreateReactNodeView = ReturnType<typeof useReactNodeViewCreator>;
type CreateReactMarkView = ReturnType<typeof useReactMarkViewCreator>;
type CreateReactPluginView = ReturnType<typeof useReactPluginViewCreator>;
type CreateReactWidgetView = ReturnType<typeof useReactWidgetViewCreator>;
declare const ProsemirrorAdapterProvider: FC<{
  children: ReactNode;
}>;
//#endregion
//#region src/widgetView/widgetViewContext.d.ts
interface WidgetViewContext {
  view: EditorView;
  getPos: () => number | undefined;
  spec?: WidgetDecorationSpec;
}
declare const widgetViewContext: react.Context<WidgetViewContext>;
declare const useWidgetViewContext: () => WidgetViewContext;
declare const createWidgetViewContext: react.Context<(options: ReactWidgetViewUserOptions) => WidgetDecorationFactory>;
declare const useWidgetViewFactory: () => (options: ReactWidgetViewUserOptions) => WidgetDecorationFactory;
//#endregion
//#region src/widgetView/ReactWidgetView.d.ts
declare class ReactWidgetView extends CoreWidgetView<ReactWidgetViewComponent> implements ReactRenderer<WidgetViewContext> {
  key: string;
  context: WidgetViewContext;
  updateContext: () => void;
  render: () => react.ReactPortal;
}
//#endregion
export { type CreateReactMarkView, type CreateReactNodeView, type CreateReactPluginView, type CreateReactWidgetView, type MarkViewContentRef, type MarkViewContext, type NodeViewContentRef, type NodeViewContext, type PluginViewContentRef, type PluginViewContext, ProsemirrorAdapterProvider, ReactMarkView, type ReactMarkViewComponent, type ReactMarkViewSpec, type ReactMarkViewUserOptions, ReactNodeView, type ReactNodeViewComponent, type ReactNodeViewSpec, type ReactNodeViewUserOptions, ReactPluginView, type ReactPluginViewComponent, type ReactPluginViewSpec, type ReactPluginViewUserOptions, ReactWidgetView, type ReactWidgetViewComponent, type ReactWidgetViewSpec, type ReactWidgetViewUserOptions, type WidgetViewContext, createMarkViewContext, createNodeViewContext, createPluginViewContext, createWidgetViewContext, markViewContext, nodeViewContext, pluginViewContext, useMarkViewContext, useMarkViewFactory, useNodeViewContext, useNodeViewFactory, usePluginViewContext, usePluginViewFactory, useWidgetViewContext, useWidgetViewFactory, widgetViewContext };
//# sourceMappingURL=index.d.ts.map
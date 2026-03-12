import * as solid_js0 from "solid-js";
import { Accessor, Component, JSX, ParentProps, ValidComponent } from "solid-js";
import { CoreMarkView, CoreMarkViewSpec, CoreMarkViewUserOptions, CoreNodeView, CoreNodeViewSpec, CoreNodeViewUserOptions, CorePluginView, CorePluginViewSpec, CorePluginViewUserOptions, CoreWidgetView, CoreWidgetViewSpec, CoreWidgetViewUserOptions, PluginViewSpec, WidgetDecorationFactory, WidgetDecorationSpec } from "@prosemirror-adapter/core";
import { Decoration, DecorationSource, EditorView, MarkViewConstructor, NodeViewConstructor } from "prosemirror-view";
import { Attrs, Mark, Node } from "prosemirror-model";
import { EditorState } from "prosemirror-state";

//#region src/markView/SolidMarkViewOptions.d.ts
type SolidMarkViewComponent = ValidComponent;
type SolidMarkViewSpec = CoreMarkViewSpec<SolidMarkViewComponent>;
type SolidMarkViewUserOptions = CoreMarkViewUserOptions<SolidMarkViewComponent>;
//#endregion
//#region src/markView/markViewContext.d.ts
type MarkViewContentRef = (element: HTMLElement | null) => void;
interface MarkViewContextProps {
  contentRef: MarkViewContentRef;
  view: EditorView;
  mark: Mark;
}
type MarkViewContext = Accessor<MarkViewContextProps>;
declare const markViewContext: solid_js0.Context<MarkViewContext>;
declare const useMarkViewContext: () => MarkViewContext;
declare const createMarkViewContext: solid_js0.Context<(options: SolidMarkViewUserOptions) => MarkViewConstructor>;
declare const useMarkViewFactory: () => (options: SolidMarkViewUserOptions) => MarkViewConstructor;
//#endregion
//#region src/SolidRenderer.d.ts
interface SolidRenderer<Context> {
  key: string;
  context: Context;
  render: () => JSX.Element;
  updateContext: () => void;
}
//#endregion
//#region src/markView/SolidMarkView.d.ts
declare class SolidMarkView extends CoreMarkView<SolidMarkViewComponent> implements SolidRenderer<MarkViewContext> {
  key: string;
  context: MarkViewContext;
  private setContext;
  constructor(spec: CoreMarkViewSpec<SolidMarkViewComponent>);
  updateContext: () => void;
  render: () => solid_js0.JSX.Element;
}
//#endregion
//#region src/nodeView/SolidNodeViewOptions.d.ts
type SolidNodeViewComponent = ValidComponent;
type SolidNodeViewSpec = CoreNodeViewSpec<SolidNodeViewComponent>;
type SolidNodeViewUserOptions = CoreNodeViewUserOptions<SolidNodeViewComponent>;
//#endregion
//#region src/nodeView/nodeViewContext.d.ts
type NodeViewContentRef = (element: HTMLElement | null) => void;
interface NodeViewContextProps {
  contentRef: NodeViewContentRef;
  view: EditorView;
  getPos: () => number | undefined;
  setAttrs: (attrs: Attrs) => void;
  node: Node;
  selected: boolean;
  decorations: readonly Decoration[];
  innerDecorations: DecorationSource;
}
type NodeViewContext = Accessor<NodeViewContextProps>;
declare const nodeViewContext: solid_js0.Context<NodeViewContext>;
declare const useNodeViewContext: () => NodeViewContext;
declare const createNodeViewContext: solid_js0.Context<(options: SolidNodeViewUserOptions) => NodeViewConstructor>;
declare const useNodeViewFactory: () => (options: SolidNodeViewUserOptions) => NodeViewConstructor;
//#endregion
//#region src/nodeView/SolidNodeView.d.ts
declare class SolidNodeView extends CoreNodeView<SolidNodeViewComponent> implements SolidRenderer<NodeViewContext> {
  key: string;
  context: NodeViewContext;
  private setContext;
  constructor(spec: CoreNodeViewSpec<SolidNodeViewComponent>);
  updateContext: () => void;
  render: () => solid_js0.JSX.Element;
}
//#endregion
//#region src/pluginView/SolidPluginViewOptions.d.ts
type SolidPluginViewComponent = ValidComponent;
type SolidPluginViewSpec = CorePluginViewSpec<SolidPluginViewComponent>;
type SolidPluginViewUserOptions = CorePluginViewUserOptions<SolidPluginViewComponent>;
//#endregion
//#region src/pluginView/pluginViewContext.d.ts
type PluginViewContentRef = (element: HTMLElement | null) => void;
interface PluginViewContextProps {
  view: EditorView;
  prevState?: EditorState;
}
type PluginViewContext = Accessor<PluginViewContextProps>;
declare const pluginViewContext: solid_js0.Context<PluginViewContext>;
declare const usePluginViewContext: () => PluginViewContext;
declare const createPluginViewContext: solid_js0.Context<(options: SolidPluginViewUserOptions) => PluginViewSpec>;
declare const usePluginViewFactory: () => (options: SolidPluginViewUserOptions) => PluginViewSpec;
//#endregion
//#region src/pluginView/SolidPluginView.d.ts
declare class SolidPluginView extends CorePluginView<SolidPluginViewComponent> implements SolidRenderer<PluginViewContext> {
  key: string;
  context: PluginViewContext;
  private setContext;
  constructor(spec: CorePluginViewSpec<SolidPluginViewComponent>);
  updateContext: () => void;
  render: () => JSX.Element;
}
//#endregion
//#region src/Provider.d.ts
declare const ProsemirrorAdapterProvider: Component<ParentProps>;
//#endregion
//#region src/widgetView/SolidWidgetViewOptions.d.ts
type SolidWidgetViewComponent = ValidComponent;
type SolidWidgetViewSpec = CoreWidgetViewSpec<SolidWidgetViewComponent>;
type SolidWidgetViewUserOptions = CoreWidgetViewUserOptions<SolidWidgetViewComponent>;
//#endregion
//#region src/widgetView/widgetViewContext.d.ts
interface WidgetViewContextProps {
  view: EditorView;
  getPos: () => number | undefined;
  spec?: WidgetDecorationSpec;
}
type WidgetViewContext = Accessor<WidgetViewContextProps>;
declare const widgetViewContext: solid_js0.Context<WidgetViewContext>;
declare const useWidgetViewContext: () => WidgetViewContext;
declare const createWidgetViewContext: solid_js0.Context<(options: SolidWidgetViewUserOptions) => WidgetDecorationFactory>;
declare const useWidgetViewFactory: () => (options: SolidWidgetViewUserOptions) => WidgetDecorationFactory;
//#endregion
//#region src/widgetView/SolidWidgetView.d.ts
declare class SolidWidgetView extends CoreWidgetView<SolidWidgetViewComponent> implements SolidRenderer<WidgetViewContext> {
  key: string;
  context: WidgetViewContext;
  private setContext;
  constructor(spec: CoreWidgetViewSpec<SolidWidgetViewComponent>);
  updateContext: () => void;
  render: () => JSX.Element;
}
//#endregion
export { MarkViewContentRef, MarkViewContext, MarkViewContextProps, NodeViewContentRef, NodeViewContext, NodeViewContextProps, PluginViewContentRef, PluginViewContext, PluginViewContextProps, ProsemirrorAdapterProvider, SolidMarkView, SolidMarkViewComponent, SolidMarkViewSpec, SolidMarkViewUserOptions, SolidNodeView, SolidNodeViewComponent, SolidNodeViewSpec, SolidNodeViewUserOptions, SolidPluginView, SolidPluginViewComponent, SolidPluginViewSpec, SolidPluginViewUserOptions, SolidWidgetView, SolidWidgetViewComponent, SolidWidgetViewSpec, SolidWidgetViewUserOptions, WidgetViewContext, WidgetViewContextProps, createMarkViewContext, createNodeViewContext, createPluginViewContext, createWidgetViewContext, markViewContext, nodeViewContext, pluginViewContext, useMarkViewContext, useMarkViewFactory, useNodeViewContext, useNodeViewFactory, usePluginViewContext, usePluginViewFactory, useWidgetViewContext, useWidgetViewFactory, widgetViewContext };
//# sourceMappingURL=index.d.ts.map
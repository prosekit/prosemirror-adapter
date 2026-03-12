import * as vue from "vue";
import { DefineComponent, InjectionKey, Ref, ShallowRef, VNodeRef } from "vue";
import { CoreMarkView, CoreMarkViewSpec, CoreMarkViewUserOptions, CoreNodeView, CoreNodeViewSpec, CoreNodeViewUserOptions, CorePluginView, CorePluginViewSpec, CorePluginViewUserOptions, CoreWidgetView, CoreWidgetViewSpec, CoreWidgetViewUserOptions, PluginViewSpec, WidgetDecorationFactory, WidgetDecorationSpec } from "@prosemirror-adapter/core";
import { Decoration, DecorationSource, EditorView, MarkViewConstructor, NodeViewConstructor } from "prosemirror-view";
import { Attrs, Mark, Node } from "prosemirror-model";
import { EditorState } from "prosemirror-state";

//#region src/markView/VueMarkViewOptions.d.ts
type VueMarkViewComponent = DefineComponent<any, any, any>;
type VueMarkViewSpec = CoreMarkViewSpec<VueMarkViewComponent>;
type VueMarkViewUserOptions = CoreMarkViewUserOptions<VueMarkViewComponent>;
//#endregion
//#region src/markView/markViewContext.d.ts
interface MarkViewContext {
  contentRef: VNodeRef;
  view: EditorView;
  mark: ShallowRef<Mark>;
}
declare const markViewContext: InjectionKey<Readonly<MarkViewContext>>;
declare const useMarkViewContext: () => Readonly<MarkViewContext>;
type MarkViewFactory = (options: VueMarkViewUserOptions) => MarkViewConstructor;
declare const markViewFactoryKey: InjectionKey<MarkViewFactory>;
declare const useMarkViewFactory: () => MarkViewFactory;
//#endregion
//#region src/VueRenderer.d.ts
type VueRendererComponent = DefineComponent<any, any, any>;
interface VueRenderer<Context> {
  key: string;
  context: Context;
  render: () => VueRendererComponent;
  updateContext: () => void;
}
interface VueRendererResult {
  readonly portals: Ref<Record<string, VueRendererComponent>>;
  readonly renderVueRenderer: (renderer: VueRenderer<unknown>) => void;
  readonly removeVueRenderer: (renderer: VueRenderer<unknown>) => void;
}
//#endregion
//#region src/markView/VueMarkView.d.ts
declare class VueMarkView extends CoreMarkView<VueMarkViewComponent> implements VueRenderer<MarkViewContext> {
  key: string;
  context: MarkViewContext;
  updateContext: () => void;
  render: () => VueRendererComponent;
}
//#endregion
//#region src/nodeView/VueNodeViewOptions.d.ts
type VueNodeViewComponent = DefineComponent<any, any, any>;
type VueNodeViewSpec = CoreNodeViewSpec<VueNodeViewComponent>;
type VueNodeViewUserOptions = CoreNodeViewUserOptions<VueNodeViewComponent>;
//#endregion
//#region src/nodeView/nodeViewContext.d.ts
interface NodeViewContext {
  contentRef: VNodeRef;
  view: EditorView;
  getPos: () => number | undefined;
  setAttrs: (attrs: Attrs) => void;
  node: ShallowRef<Node>;
  selected: ShallowRef<boolean>;
  decorations: ShallowRef<readonly Decoration[]>;
  innerDecorations: ShallowRef<DecorationSource>;
}
declare const nodeViewContext: InjectionKey<Readonly<NodeViewContext>>;
declare const useNodeViewContext: () => Readonly<NodeViewContext>;
type NodeViewFactory = (options: VueNodeViewUserOptions) => NodeViewConstructor;
declare const nodeViewFactoryKey: InjectionKey<NodeViewFactory>;
declare const useNodeViewFactory: () => NodeViewFactory;
//#endregion
//#region src/nodeView/VueNodeView.d.ts
declare class VueNodeView extends CoreNodeView<VueNodeViewComponent> implements VueRenderer<NodeViewContext> {
  key: string;
  context: NodeViewContext;
  updateContext: () => void;
  render: () => VueRendererComponent;
}
//#endregion
//#region src/pluginView/VuePluginViewOptions.d.ts
type VuePluginViewComponent = DefineComponent<any, any, any>;
type VuePluginViewSpec = CorePluginViewSpec<VuePluginViewComponent>;
type VuePluginViewUserOptions = CorePluginViewUserOptions<VuePluginViewComponent>;
//#endregion
//#region src/pluginView/pluginViewContext.d.ts
type PluginViewContentRef = (element: HTMLElement | null) => void;
interface PluginViewContext {
  view: ShallowRef<EditorView>;
  prevState: ShallowRef<EditorState | undefined>;
}
declare const pluginViewContext: InjectionKey<Readonly<PluginViewContext>>;
declare const usePluginViewContext: () => Readonly<PluginViewContext>;
type PluginViewFactory = (options: VuePluginViewUserOptions) => PluginViewSpec;
declare const pluginViewFactoryKey: InjectionKey<PluginViewFactory>;
declare const usePluginViewFactory: () => PluginViewFactory;
//#endregion
//#region src/pluginView/VuePluginView.d.ts
declare class VuePluginView extends CorePluginView<VuePluginViewComponent> implements VueRenderer<PluginViewContext> {
  key: string;
  context: PluginViewContext;
  updateContext: () => void;
  render: () => VueRendererComponent;
}
//#endregion
//#region src/markView/useVueMarkViewCreator.d.ts
declare function useVueMarkViewCreator(renderVueRenderer: VueRendererResult['renderVueRenderer'], removeVueRenderer: VueRendererResult['removeVueRenderer']): MarkViewFactory;
//#endregion
//#region src/nodeView/useVueNodeViewCreator.d.ts
declare function useVueNodeViewCreator(renderVueRenderer: VueRendererResult['renderVueRenderer'], removeVueRenderer: VueRendererResult['removeVueRenderer']): NodeViewFactory;
//#endregion
//#region src/pluginView/useVuePluginViewCreator.d.ts
declare function useVuePluginViewCreator(renderVueRenderer: VueRendererResult['renderVueRenderer'], removeVueRenderer: VueRendererResult['removeVueRenderer']): PluginViewFactory;
//#endregion
//#region src/widgetView/VueWidgetViewOptions.d.ts
type VueWidgetViewComponent = DefineComponent<any, any, any>;
type VueWidgetViewSpec = CoreWidgetViewSpec<VueWidgetViewComponent>;
type VueWidgetViewUserOptions = CoreWidgetViewUserOptions<VueWidgetViewComponent>;
//#endregion
//#region src/widgetView/useVueWidgetViewCreator.d.ts
declare function useVueWidgetViewCreator(renderVueRenderer: VueRendererResult['renderVueRenderer'], removeVueRenderer: VueRendererResult['removeVueRenderer']): (options: VueWidgetViewUserOptions) => WidgetDecorationFactory;
//#endregion
//#region src/Provider.d.ts
type CreateVueNodeView = ReturnType<typeof useVueNodeViewCreator>;
type CreateVueMarkView = ReturnType<typeof useVueMarkViewCreator>;
type CreateVuePluginView = ReturnType<typeof useVuePluginViewCreator>;
type CreateVueWidgetView = ReturnType<typeof useVueWidgetViewCreator>;
declare const ProsemirrorAdapterProvider: vue.DefineComponent<{}, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
  [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;
//#endregion
//#region src/widgetView/widgetViewContext.d.ts
interface WidgetViewContext {
  view: EditorView;
  getPos: () => number | undefined;
  spec?: WidgetDecorationSpec;
}
declare const widgetViewContext: InjectionKey<Readonly<WidgetViewContext>>;
declare const useWidgetViewContext: () => Readonly<WidgetViewContext>;
type WidgetViewFactory = (options: VueWidgetViewUserOptions) => WidgetDecorationFactory;
declare const widgetViewFactoryKey: InjectionKey<WidgetViewFactory>;
declare const useWidgetViewFactory: () => WidgetViewFactory;
//#endregion
//#region src/widgetView/VueWidgetView.d.ts
declare class VueWidgetView extends CoreWidgetView<VueWidgetViewComponent> implements VueRenderer<WidgetViewContext> {
  key: string;
  context: WidgetViewContext;
  updateContext: () => void;
  render: () => VueRendererComponent;
}
//#endregion
export { type CreateVueMarkView, type CreateVueNodeView, type CreateVuePluginView, type CreateVueWidgetView, type MarkViewContext, type MarkViewFactory, type NodeViewContext, type NodeViewFactory, type PluginViewContentRef, type PluginViewContext, type PluginViewFactory, ProsemirrorAdapterProvider, VueMarkView, type VueMarkViewComponent, type VueMarkViewSpec, type VueMarkViewUserOptions, VueNodeView, type VueNodeViewComponent, type VueNodeViewSpec, type VueNodeViewUserOptions, VuePluginView, type VuePluginViewComponent, type VuePluginViewSpec, type VuePluginViewUserOptions, VueWidgetView, type VueWidgetViewComponent, type VueWidgetViewSpec, type VueWidgetViewUserOptions, type WidgetViewContext, type WidgetViewFactory, markViewContext, markViewFactoryKey, nodeViewContext, nodeViewFactoryKey, pluginViewContext, pluginViewFactoryKey, useMarkViewContext, useMarkViewFactory, useNodeViewContext, useNodeViewFactory, usePluginViewContext, usePluginViewFactory, useWidgetViewContext, useWidgetViewFactory, widgetViewContext, widgetViewFactoryKey };
//# sourceMappingURL=index.d.ts.map
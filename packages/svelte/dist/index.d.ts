import { Component, ComponentConstructorOptions, SvelteComponent } from "svelte";
import { CoreMarkView, CoreMarkViewSpec, CoreMarkViewUserOptions, CoreNodeView, CoreNodeViewSpec, CoreNodeViewUserOptions, CorePluginView, CorePluginViewSpec, CorePluginViewUserOptions, CoreWidgetView, CoreWidgetViewSpec, CoreWidgetViewUserOptions, PluginViewSpec, WidgetDecorationFactory, WidgetDecorationSpec } from "@prosemirror-adapter/core";
import { Writable } from "svelte/store";
import { Decoration, DecorationSource, EditorView, MarkViewConstructor, NodeViewConstructor } from "prosemirror-view";
import { Attrs, Mark, Node } from "prosemirror-model";
import { EditorState } from "prosemirror-state";

//#region src/types.d.ts
type AnyRecord = Record<string, any>;
type SvelteClassComponentConstructor<T extends AnyRecord = any> = new (options: ComponentConstructorOptions<T>) => SvelteComponent;
type SvelteComponentConstructor<T extends AnyRecord = any> = SvelteClassComponentConstructor<T> | Component<T>;
/**
 * @internal
 */
interface SvelteRenderOptions {
  context: Map<unknown, unknown>;
}
//#endregion
//#region src/markView/SvelteMarkViewOptions.d.ts
type SvelteMarkViewComponent = SvelteComponentConstructor;
type SvelteMarkViewSpec = CoreMarkViewSpec<SvelteMarkViewComponent>;
type SvelteMarkViewUserOptions = CoreMarkViewUserOptions<SvelteMarkViewComponent>;
//#endregion
//#region src/markView/markViewContext.d.ts
interface MarkViewContext {
  contentRef: (element: HTMLElement | null) => void;
  view: EditorView;
  mark: Writable<Mark>;
}
declare function useMarkViewContext<Key extends keyof MarkViewContext>(key: Key): MarkViewContext[Key];
declare const markViewFactoryKey = "[ProsemirrorAdapter]useMarkViewFactory";
type MarkViewFactory = (options: SvelteMarkViewUserOptions) => MarkViewConstructor;
declare const useMarkViewFactory: () => MarkViewFactory;
//#endregion
//#region src/SvelteRenderer.d.ts
interface SvelteRenderer<Context> {
  key: string;
  context: Context;
  render: (options: SvelteRenderOptions) => VoidFunction;
  updateContext: () => void;
}
//#endregion
//#region src/markView/SvelteMarkView.d.ts
declare class SvelteMarkView extends CoreMarkView<SvelteMarkViewComponent> implements SvelteRenderer<MarkViewContext> {
  key: string;
  context: MarkViewContext;
  updateContext: () => void;
  render: (options: SvelteRenderOptions) => VoidFunction;
}
//#endregion
//#region src/nodeView/SvelteNodeViewOptions.d.ts
type SvelteNodeViewComponent = SvelteComponentConstructor;
type SvelteNodeViewSpec = CoreNodeViewSpec<SvelteNodeViewComponent>;
type SvelteNodeViewUserOptions = CoreNodeViewUserOptions<SvelteNodeViewComponent>;
//#endregion
//#region src/nodeView/nodeViewContext.d.ts
interface NodeViewContext {
  contentRef: (element: HTMLElement | null) => void;
  view: EditorView;
  getPos: () => number | undefined;
  setAttrs: (attrs: Attrs) => void;
  node: Writable<Node>;
  selected: Writable<boolean>;
  decorations: Writable<readonly Decoration[]>;
  innerDecorations: Writable<DecorationSource>;
}
declare function useNodeViewContext<Key extends keyof NodeViewContext>(key: Key): NodeViewContext[Key];
declare const nodeViewFactoryKey = "[ProsemirrorAdapter]useNodeViewFactory";
type NodeViewFactory = (options: SvelteNodeViewUserOptions) => NodeViewConstructor;
declare const useNodeViewFactory: () => NodeViewFactory;
//#endregion
//#region src/nodeView/SvelteNodeView.d.ts
declare class SvelteNodeView extends CoreNodeView<SvelteNodeViewComponent> implements SvelteRenderer<NodeViewContext> {
  key: string;
  context: NodeViewContext;
  updateContext: () => void;
  render: (options: SvelteRenderOptions) => VoidFunction;
}
//#endregion
//#region src/pluginView/SveltePluginViewOptions.d.ts
type SveltePluginViewComponent = SvelteComponentConstructor;
type SveltePluginViewSpec = CorePluginViewSpec<SveltePluginViewComponent>;
type SveltePluginViewUserOptions = CorePluginViewUserOptions<SveltePluginViewComponent>;
//#endregion
//#region src/pluginView/pluginViewContext.d.ts
type PluginViewContentRef = (element: HTMLElement | null) => void;
interface PluginViewContext {
  view: Writable<EditorView>;
  prevState: Writable<EditorState | undefined>;
}
declare function usePluginViewContext<Key extends keyof PluginViewContext>(key: Key): PluginViewContext[Key];
type PluginViewFactory = (options: SveltePluginViewUserOptions) => PluginViewSpec;
declare const pluginViewFactoryKey = "[ProsemirrorAdapter]usePluginViewFactory";
declare const usePluginViewFactory: () => PluginViewFactory;
//#endregion
//#region src/pluginView/SveltePluginView.d.ts
declare class SveltePluginView extends CorePluginView<SveltePluginViewComponent> implements SvelteRenderer<PluginViewContext> {
  key: string;
  context: PluginViewContext;
  updateContext: () => void;
  render: (options: SvelteRenderOptions) => VoidFunction;
}
//#endregion
//#region src/Provider.d.ts
declare function useProsemirrorAdapterProvider(): void;
//#endregion
//#region src/widgetView/SvelteWidgetViewOptions.d.ts
type SvelteWidgetViewComponent = SvelteComponentConstructor;
type SvelteWidgetViewSpec = CoreWidgetViewSpec<SvelteWidgetViewComponent>;
type SvelteWidgetViewUserOptions = CoreWidgetViewUserOptions<SvelteWidgetViewComponent>;
//#endregion
//#region src/widgetView/widgetViewContext.d.ts
interface WidgetViewContext {
  view: EditorView;
  getPos: () => number | undefined;
  spec?: WidgetDecorationSpec;
}
declare function useWidgetViewContext<Key extends keyof WidgetViewContext>(key: Key): WidgetViewContext[Key];
type WidgetViewFactory = (options: SvelteWidgetViewUserOptions) => WidgetDecorationFactory;
declare const widgetViewFactoryKey = "[ProsemirrorAdapter]useWidgetViewFactory";
declare const useWidgetViewFactory: () => WidgetViewFactory;
//#endregion
//#region src/widgetView/SvelteWidgetView.d.ts
declare class SvelteWidgetView extends CoreWidgetView<SvelteWidgetViewComponent> implements SvelteRenderer<WidgetViewContext> {
  key: string;
  context: WidgetViewContext;
  updateContext: () => void;
  render: (options: SvelteRenderOptions) => VoidFunction;
}
//#endregion
export { MarkViewContext, MarkViewFactory, NodeViewContext, NodeViewFactory, PluginViewContentRef, PluginViewContext, PluginViewFactory, SvelteMarkView, SvelteMarkViewComponent, SvelteMarkViewSpec, SvelteMarkViewUserOptions, SvelteNodeView, SvelteNodeViewComponent, SvelteNodeViewSpec, SvelteNodeViewUserOptions, SveltePluginView, SveltePluginViewComponent, SveltePluginViewSpec, SveltePluginViewUserOptions, SvelteWidgetView, SvelteWidgetViewComponent, SvelteWidgetViewSpec, SvelteWidgetViewUserOptions, WidgetViewContext, WidgetViewFactory, markViewFactoryKey, nodeViewFactoryKey, pluginViewFactoryKey, useMarkViewContext, useMarkViewFactory, useNodeViewContext, useNodeViewFactory, usePluginViewContext, usePluginViewFactory, useProsemirrorAdapterProvider, useWidgetViewContext, useWidgetViewFactory, widgetViewFactoryKey };
//# sourceMappingURL=index.d.ts.map
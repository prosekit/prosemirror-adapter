import { Context, ContextConsumer, ContextProvider } from "@lit/context";
import { CoreMarkView, CoreMarkViewSpec, CoreMarkViewUserOptions, CoreNodeView, CoreNodeViewSpec, CoreNodeViewUserOptions, CorePluginView, CorePluginViewSpec, CorePluginViewUserOptions, CoreWidgetView, CoreWidgetViewSpec, CoreWidgetViewUserOptions, PluginViewSpec, WidgetDecorationFactory, WidgetDecorationSpec } from "@prosemirror-adapter/core";
import * as lit from "lit";
import { LitElement } from "lit";
import { Decoration, DecorationSource, EditorView, MarkViewConstructor, NodeViewConstructor } from "prosemirror-view";
import { RefOrCallback } from "lit/directives/ref.js";
import { Attrs, Mark, Node } from "prosemirror-model";
import { EditorState } from "prosemirror-state";

//#region src/LitRenderer.d.ts
interface LitRenderer<Context> {
  key: string;
  context: Context;
  render: () => LitElement;
  updateContext: () => void;
}
//#endregion
//#region src/utils/ShallowLitElement.d.ts
declare class ShallowLitElement extends LitElement {
  connectedCallback(): void;
  createRenderRoot(): HTMLElement;
}
//#endregion
//#region src/markView/LitMarkViewOptions.d.ts
type LitMarkViewComponent = typeof LitElement;
type LitMarkViewSpec = CoreMarkViewSpec<LitMarkViewComponent>;
type LitMarkViewUserOptions = CoreMarkViewUserOptions<LitMarkViewComponent>;
//#endregion
//#region src/markView/markViewContext.d.ts
interface MarkViewContext {
  contentRef: RefOrCallback;
  view: EditorView;
  mark: Mark;
}
declare const markViewContextKey: {
  __context__: MarkViewContext;
};
type ConsumeMarkViewContext = ContextConsumer<typeof markViewContextKey, LitElement>;
declare function useMarkViewContext(element: LitElement): ConsumeMarkViewContext;
declare const markViewFactoryKey: {
  __context__: MarkViewFactory;
};
type MarkViewFactory = (options: LitMarkViewUserOptions) => MarkViewConstructor;
type ConsumeMarkViewFactory = ContextConsumer<typeof markViewFactoryKey, LitElement>;
declare function useMarkViewFactory(element: LitElement): ConsumeMarkViewFactory;
//#endregion
//#region src/markView/LitMarkView.d.ts
declare global {
  interface HTMLElementTagNameMap {
    'mark-view-dom-provider': MarkViewDOMProvider;
  }
}
declare class MarkViewDOMProvider extends ShallowLitElement {
  markView: LitMarkView;
  provider: ContextProvider<Context<typeof markViewContextKey, MarkViewContext>>;
  createRenderRoot(): this;
  constructor(markView: LitMarkView);
  create: () => lit.LitElement;
  updateContext: () => void;
}
declare class LitMarkView extends CoreMarkView<LitMarkViewComponent> implements LitRenderer<MarkViewContext> {
  key: string;
  provider: MarkViewDOMProvider;
  context: MarkViewContext;
  updateContext: () => void;
  render: () => lit.LitElement;
}
//#endregion
//#region src/nodeView/LitNodeViewOptions.d.ts
type LitNodeViewComponent = typeof LitElement;
type LitNodeViewSpec = CoreNodeViewSpec<LitNodeViewComponent>;
type LitNodeViewUserOptions = CoreNodeViewUserOptions<LitNodeViewComponent>;
//#endregion
//#region src/nodeView/nodeViewContext.d.ts
interface NodeViewContext {
  contentRef: RefOrCallback;
  view: EditorView;
  getPos: () => number | undefined;
  setAttrs: (attrs: Attrs) => void;
  node: Node;
  selected: boolean;
  decorations: readonly Decoration[];
  innerDecorations: DecorationSource;
}
declare const nodeViewContextKey: {
  __context__: NodeViewContext;
};
type ConsumeNodeViewContext = ContextConsumer<typeof nodeViewContextKey, LitElement>;
declare function useNodeViewContext(element: LitElement): ConsumeNodeViewContext;
declare const nodeViewFactoryKey: {
  __context__: NodeViewFactory;
};
type NodeViewFactory = (options: LitNodeViewUserOptions) => NodeViewConstructor;
type ConsumeNodeViewFactory = ContextConsumer<typeof nodeViewFactoryKey, LitElement>;
declare function useNodeViewFactory(element: LitElement): ConsumeNodeViewFactory;
//#endregion
//#region src/nodeView/LitNodeView.d.ts
declare global {
  interface HTMLElementTagNameMap {
    'node-view-dom-provider': NodeViewDOMProvider;
  }
}
declare class NodeViewDOMProvider extends ShallowLitElement {
  nodeView: LitNodeView;
  provider: ContextProvider<Context<typeof nodeViewContextKey, NodeViewContext>>;
  createRenderRoot(): this;
  constructor(nodeView: LitNodeView);
  create: () => lit.LitElement;
  updateContext: () => void;
}
declare class LitNodeView extends CoreNodeView<LitNodeViewComponent> implements LitRenderer<NodeViewContext> {
  key: string;
  provider: NodeViewDOMProvider;
  context: NodeViewContext;
  updateContext: () => void;
  render: () => lit.LitElement;
}
//#endregion
//#region src/pluginView/LitPluginViewOptions.d.ts
type LitPluginViewComponent = typeof LitElement;
type LitPluginViewSpec = CorePluginViewSpec<LitPluginViewComponent>;
type LitPluginViewUserOptions = CorePluginViewUserOptions<LitPluginViewComponent>;
//#endregion
//#region src/pluginView/pluginViewContext.d.ts
interface PluginViewContext {
  view: EditorView;
  prevState: EditorState | undefined;
}
declare const pluginViewContextKey: {
  __context__: PluginViewContext;
};
type ConsumePluginViewContext = ContextConsumer<typeof pluginViewContextKey, LitElement>;
declare function usePluginViewContext(element: LitElement): ConsumePluginViewContext;
type PluginViewFactory = (options: LitPluginViewUserOptions) => PluginViewSpec;
declare const pluginViewFactoryKey: {
  __context__: PluginViewFactory;
};
type ConsumePluginViewFactory = ContextConsumer<typeof pluginViewFactoryKey, LitElement>;
declare function usePluginViewFactory(element: LitElement): ConsumePluginViewFactory;
//#endregion
//#region src/pluginView/LitPluginView.d.ts
declare global {
  interface HTMLElementTagNameMap {
    'plugin-view-dom-provider': PluginViewDOMProvider;
  }
}
declare class PluginViewDOMProvider extends ShallowLitElement {
  pluginView: LitPluginView;
  provider: ContextProvider<Context<typeof pluginViewContextKey, PluginViewContext>>;
  createRenderRoot(): this;
  constructor(pluginView: LitPluginView);
  create: () => lit.LitElement;
  updateContext: () => void;
}
declare class LitPluginView extends CorePluginView<LitPluginViewComponent> implements LitRenderer<PluginViewContext> {
  key: string;
  provider: PluginViewDOMProvider;
  context: PluginViewContext;
  updateContext: () => void;
  render: () => lit.LitElement;
}
//#endregion
//#region src/widgetView/LitWidgetViewOptions.d.ts
type LitWidgetViewComponent = typeof LitElement;
type LitWidgetViewSpec = CoreWidgetViewSpec<LitWidgetViewComponent>;
type LitWidgetViewUserOptions = CoreWidgetViewUserOptions<LitWidgetViewComponent>;
//#endregion
//#region src/widgetView/widgetViewContext.d.ts
interface WidgetViewContext {
  view: EditorView;
  getPos: () => number | undefined;
  spec?: WidgetDecorationSpec;
}
declare const widgetViewContextKey: {
  __context__: WidgetViewContext;
};
type ConsumeWidgetViewContext = ContextConsumer<typeof widgetViewContextKey, LitElement>;
declare function useWidgetViewContext(element: LitElement): ConsumeWidgetViewContext;
type WidgetViewFactory = (options: LitWidgetViewUserOptions) => WidgetDecorationFactory;
declare const widgetViewFactoryKey: {
  __context__: WidgetViewFactory;
};
type ConsumeWidgetViewFactory = ContextConsumer<typeof widgetViewFactoryKey, LitElement>;
declare function useWidgetViewFactory(element: LitElement): ConsumeWidgetViewFactory;
//#endregion
//#region src/widgetView/LitWidgetView.d.ts
declare global {
  interface HTMLElementTagNameMap {
    'widget-view-dom-provider': WidgetViewDOMProvider;
  }
}
declare class WidgetViewDOMProvider extends ShallowLitElement {
  widgetView: LitWidgetView;
  provider: ContextProvider<Context<typeof widgetViewContextKey, WidgetViewContext>>;
  createRenderRoot(): this;
  constructor(widgetView: LitWidgetView);
  create: () => lit.LitElement;
  updateContext: () => void;
}
declare class LitWidgetView extends CoreWidgetView<LitWidgetViewComponent> implements LitRenderer<WidgetViewContext> {
  key: string;
  provider: WidgetViewDOMProvider;
  context: WidgetViewContext;
  updateContext: () => void;
  render: () => lit.LitElement;
}
//#endregion
//#region src/Provider.d.ts
declare class ProsemirrorAdapterProvider extends ShallowLitElement {
  createLitNodeView: ContextProvider<typeof nodeViewFactoryKey>;
  createLitMarkView: ContextProvider<typeof markViewFactoryKey>;
  createLitPluginView: ContextProvider<typeof pluginViewFactoryKey>;
  createLitWidgetView: ContextProvider<typeof widgetViewFactoryKey>;
  constructor();
}
declare global {
  interface HTMLElementTagNameMap {
    'prosemirror-adapter-provider': ProsemirrorAdapterProvider;
  }
} //# sourceMappingURL=Provider.d.ts.map
//#endregion
export { type ConsumeMarkViewContext, type ConsumeMarkViewFactory, type ConsumeNodeViewContext, type ConsumeNodeViewFactory, type ConsumePluginViewContext, type ConsumePluginViewFactory, type ConsumeWidgetViewContext, type ConsumeWidgetViewFactory, LitMarkView, type LitMarkViewComponent, type LitMarkViewSpec, type LitMarkViewUserOptions, LitNodeView, type LitNodeViewComponent, type LitNodeViewSpec, type LitNodeViewUserOptions, LitPluginView, type LitPluginViewComponent, type LitPluginViewSpec, type LitPluginViewUserOptions, LitWidgetView, type LitWidgetViewComponent, type LitWidgetViewSpec, type LitWidgetViewUserOptions, type MarkViewContext, MarkViewDOMProvider, type MarkViewFactory, type NodeViewContext, NodeViewDOMProvider, type NodeViewFactory, type PluginViewContext, PluginViewDOMProvider, type PluginViewFactory, ProsemirrorAdapterProvider, ShallowLitElement, type WidgetViewContext, WidgetViewDOMProvider, type WidgetViewFactory, markViewContextKey, markViewFactoryKey, nodeViewContextKey, nodeViewFactoryKey, pluginViewContextKey, pluginViewFactoryKey, useMarkViewContext, useMarkViewFactory, useNodeViewContext, useNodeViewFactory, usePluginViewContext, usePluginViewFactory, useWidgetViewContext, useWidgetViewFactory, widgetViewContextKey, widgetViewFactoryKey };
//# sourceMappingURL=index.d.ts.map
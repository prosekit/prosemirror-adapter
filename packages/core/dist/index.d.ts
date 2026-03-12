import { Attrs, Mark, Node } from "prosemirror-model";
import { Decoration, DecorationSource, EditorView, MarkView, NodeView, ViewMutationRecord } from "prosemirror-view";
import { EditorState, PluginSpec, PluginView } from "prosemirror-state";

//#region src/markView/CoreMarkViewOptions.d.ts
type MarkViewDOMSpec = string | HTMLElement | ((mark: Mark) => HTMLElement);
interface CoreMarkViewUserOptions<Component> {
  as?: MarkViewDOMSpec;
  contentAs?: MarkViewDOMSpec;
  component: Component;
  ignoreMutation?: (mutation: ViewMutationRecord) => boolean | void;
  destroy?: () => void;
}
interface CoreMarkViewSpec<Component> {
  mark: Mark;
  view: EditorView;
  inline: boolean;
  options: CoreMarkViewUserOptions<Component>;
}
//#endregion
//#region src/markView/CoreMarkView.d.ts
declare class CoreMarkView<ComponentType> implements MarkView {
  #private;
  dom: HTMLElement;
  contentDOM: HTMLElement;
  mark: Mark;
  view: EditorView;
  inline: boolean;
  options: CoreMarkViewUserOptions<ComponentType>;
  createDOM(as?: MarkViewDOMSpec): HTMLElement;
  createContentDOM(as?: MarkViewDOMSpec): HTMLElement;
  constructor({
    mark,
    view,
    inline,
    options
  }: CoreMarkViewSpec<ComponentType>);
  get component(): ComponentType;
  shouldIgnoreMutation: (mutation: ViewMutationRecord) => boolean;
  ignoreMutation: (mutation: ViewMutationRecord) => boolean;
  destroy: () => void;
}
//#endregion
//#region src/nodeView/CoreNodeViewOptions.d.ts
type NodeViewDOMSpec = string | HTMLElement | ((node: Node) => HTMLElement);
interface CoreNodeViewUserOptions<Component> {
  as?: NodeViewDOMSpec;
  contentAs?: NodeViewDOMSpec;
  component: Component;
  update?: (node: Node, decorations: readonly Decoration[], innerDecorations: DecorationSource) => boolean | void;
  ignoreMutation?: (mutation: ViewMutationRecord) => boolean | void;
  selectNode?: () => void;
  deselectNode?: () => void;
  setSelection?: (anchor: number, head: number, root: Document | ShadowRoot) => void;
  stopEvent?: (event: Event) => boolean;
  destroy?: () => void;
  onUpdate?: () => void;
}
interface CoreNodeViewSpec<Component> {
  node: Node;
  view: EditorView;
  getPos: () => number | undefined;
  decorations: readonly Decoration[];
  innerDecorations: DecorationSource;
  options: CoreNodeViewUserOptions<Component>;
}
//#endregion
//#region src/nodeView/CoreNodeView.d.ts
declare class CoreNodeView<ComponentType> implements NodeView {
  #private;
  dom: HTMLElement;
  contentDOM: HTMLElement | null;
  node: Node;
  view: EditorView;
  getPos: () => number | undefined;
  decorations: readonly Decoration[];
  innerDecorations: DecorationSource;
  options: CoreNodeViewUserOptions<ComponentType>;
  selected: boolean;
  setSelection?: (anchor: number, head: number, root: Document | ShadowRoot) => void;
  stopEvent?: (event: Event) => boolean;
  createDOM(as?: NodeViewDOMSpec): HTMLElement;
  createContentDOM(as?: NodeViewDOMSpec): HTMLElement;
  constructor({
    node,
    view,
    getPos,
    decorations,
    innerDecorations,
    options
  }: CoreNodeViewSpec<ComponentType>);
  get component(): ComponentType;
  selectNode: () => void;
  deselectNode: () => void;
  shouldUpdate: (node: Node) => boolean;
  update: (node: Node, decorations: readonly Decoration[], innerDecorations: DecorationSource) => boolean;
  shouldIgnoreMutation: (mutation: ViewMutationRecord) => boolean;
  ignoreMutation: (mutation: ViewMutationRecord) => boolean;
  destroy: () => void;
  setAttrs: (attr: Attrs) => void;
}
//#endregion
//#region src/pluginView/CorePluginViewOptions.d.ts
interface CorePluginViewSpec<Component> {
  view: EditorView;
  options: CorePluginViewUserOptions<Component>;
}
interface CorePluginViewUserOptions<Component> {
  component: Component;
  root?: (viewDOM: HTMLElement) => HTMLElement;
  update?: (view: EditorView, prevState: EditorState) => void;
  destroy?: () => void;
}
type PluginViewSpec = Required<PluginSpec<unknown>>['view'];
//#endregion
//#region src/pluginView/CorePluginView.d.ts
declare class CorePluginView<ComponentType> implements PluginView {
  view: EditorView;
  prevState?: EditorState;
  options: CorePluginViewUserOptions<ComponentType>;
  constructor(spec: CorePluginViewSpec<ComponentType>);
  get component(): ComponentType;
  get root(): HTMLElement;
  update(view: EditorView, prevState: EditorState): void;
  destroy(): void;
}
//#endregion
//#region src/widgetView/CoreWidgetViewOptions.d.ts
type WidgetDecoration = typeof Decoration.widget;
type WidgetDecorationSpec = NonNullable<Parameters<WidgetDecoration>[2]>;
type WidgetDecorationFactory = (pos: number, spec?: WidgetDecorationSpec) => Decoration;
interface CoreWidgetViewUserOptions<Component> {
  as: string | HTMLElement;
  component: Component;
}
interface CoreWidgetViewSpec<Component> {
  pos: number;
  spec?: WidgetDecorationSpec;
  options: CoreWidgetViewUserOptions<Component>;
}
//#endregion
//#region src/widgetView/CoreWidgetView.d.ts
declare class CoreWidgetView<Component> {
  #private;
  dom: HTMLElement;
  pos: number;
  view?: EditorView;
  getPos?: () => number | undefined;
  spec?: WidgetDecorationSpec;
  options: CoreWidgetViewUserOptions<Component>;
  constructor({
    pos,
    spec,
    options
  }: CoreWidgetViewSpec<Component>);
  bind(view: EditorView, getPos: () => number | undefined): void;
  get component(): Component;
}
//#endregion
export { CoreMarkView, CoreMarkViewSpec, CoreMarkViewUserOptions, CoreNodeView, CoreNodeViewSpec, CoreNodeViewUserOptions, CorePluginView, CorePluginViewSpec, CorePluginViewUserOptions, CoreWidgetView, CoreWidgetViewSpec, CoreWidgetViewUserOptions, MarkViewDOMSpec, NodeViewDOMSpec, PluginViewSpec, WidgetDecoration, WidgetDecorationFactory, WidgetDecorationSpec };
//# sourceMappingURL=index.d.ts.map
import { Fragment, Teleport, defineComponent, getCurrentInstance, h, inject, markRaw, onBeforeMount, onUnmounted, provide, ref, shallowRef } from "vue";
import { CoreMarkView, CoreNodeView, CorePluginView, CoreWidgetView } from "@prosemirror-adapter/core";
import { nanoid } from "nanoid";
import { Decoration } from "prosemirror-view";
//#region src/markView/markViewContext.ts
const markViewContext = Symbol("[ProsemirrorAdapter]markViewContext");
const useMarkViewContext = () => inject(markViewContext);
const markViewFactoryKey = Symbol("[ProsemirrorAdapter]useMarkViewFactory");
const useMarkViewFactory = () => inject(markViewFactoryKey);
//#endregion
//#region src/markView/VueMarkView.ts
var VueMarkView = class extends CoreMarkView {
	constructor(..._args) {
		super(..._args);
		this.key = nanoid();
		this.context = {
			contentRef: (element) => {
				if (element && element instanceof HTMLElement && this.contentDOM && element.firstChild !== this.contentDOM) element.appendChild(this.contentDOM);
			},
			view: this.view,
			mark: shallowRef(this.mark)
		};
		this.updateContext = () => {
			Object.entries({ mark: this.mark }).forEach(([key, value]) => {
				const prev = this.context[key];
				if (prev.value !== value) prev.value = value;
			});
		};
		this.render = () => {
			const UserComponent = this.component;
			return markRaw(defineComponent({
				name: "ProsemirrorMarkView",
				setup: () => {
					provide(markViewContext, this.context);
					return () => h(Teleport, {
						key: this.key,
						to: this.dom
					}, [h(UserComponent)]);
				}
			}));
		};
	}
};
//#endregion
//#region src/nodeView/nodeViewContext.ts
const nodeViewContext = Symbol("[ProsemirrorAdapter]nodeViewContext");
const useNodeViewContext = () => inject(nodeViewContext);
const nodeViewFactoryKey = Symbol("[ProsemirrorAdapter]useNodeViewFactory");
const useNodeViewFactory = () => inject(nodeViewFactoryKey);
//#endregion
//#region src/nodeView/VueNodeView.ts
var VueNodeView = class extends CoreNodeView {
	constructor(..._args) {
		super(..._args);
		this.key = nanoid();
		this.context = {
			contentRef: (element) => {
				if (element && element instanceof HTMLElement && this.contentDOM && element.firstChild !== this.contentDOM) element.appendChild(this.contentDOM);
			},
			view: this.view,
			getPos: this.getPos,
			setAttrs: this.setAttrs,
			node: shallowRef(this.node),
			selected: shallowRef(this.selected),
			decorations: shallowRef(this.decorations),
			innerDecorations: shallowRef(this.innerDecorations)
		};
		this.updateContext = () => {
			Object.entries({
				node: this.node,
				selected: this.selected,
				decorations: this.decorations,
				innerDecorations: this.innerDecorations
			}).forEach(([key, value]) => {
				const prev = this.context[key];
				if (prev.value !== value) prev.value = value;
			});
		};
		this.render = () => {
			const UserComponent = this.component;
			return markRaw(defineComponent({
				name: "ProsemirrorNodeView",
				setup: () => {
					provide(nodeViewContext, this.context);
					return () => h(Teleport, {
						key: this.key,
						to: this.dom
					}, [h(UserComponent)]);
				}
			}));
		};
	}
};
//#endregion
//#region src/pluginView/pluginViewContext.ts
const pluginViewContext = Symbol("[ProsemirrorAdapter]nodeViewContext");
const usePluginViewContext = () => inject(pluginViewContext);
const pluginViewFactoryKey = Symbol("[ProsemirrorAdapter]usePluginViewFactory");
const usePluginViewFactory = () => inject(pluginViewFactoryKey);
//#endregion
//#region src/pluginView/VuePluginView.ts
var VuePluginView = class extends CorePluginView {
	constructor(..._args) {
		super(..._args);
		this.key = nanoid();
		this.context = {
			view: shallowRef(this.view),
			prevState: shallowRef(this.prevState)
		};
		this.updateContext = () => {
			Object.entries({
				view: this.view,
				prevState: this.prevState
			}).forEach(([key, value]) => {
				const prev = this.context[key];
				if (key === "view") {
					prev.value = Object.assign(Object.create(Object.getPrototypeOf(value)), value);
					return;
				}
				prev.value = value;
			});
		};
		this.render = () => {
			const UserComponent = this.component;
			return markRaw(defineComponent({
				name: "ProsemirrorNodeView",
				setup: () => {
					provide(pluginViewContext, this.context);
					return () => h(Teleport, {
						key: this.key,
						to: this.root
					}, [h(UserComponent)]);
				}
			}));
		};
	}
};
//#endregion
//#region src/markView/useVueMarkViewCreator.ts
function useVueMarkViewCreator(renderVueRenderer, removeVueRenderer) {
	const createVueMarkView = (options) => (mark, view, inline) => {
		const nodeView = new VueMarkView({
			mark,
			view,
			inline,
			options: {
				...options,
				destroy() {
					options.destroy?.();
					removeVueRenderer(nodeView);
				}
			}
		});
		renderVueRenderer(nodeView);
		return nodeView;
	};
	return createVueMarkView;
}
//#endregion
//#region src/nodeView/useVueNodeViewCreator.ts
function useVueNodeViewCreator(renderVueRenderer, removeVueRenderer) {
	const createVueNodeView = (options) => (node, view, getPos, decorations, innerDecorations) => {
		const nodeView = new VueNodeView({
			node,
			view,
			getPos,
			decorations,
			innerDecorations,
			options: {
				...options,
				onUpdate() {
					options.onUpdate?.();
					nodeView.updateContext();
				},
				selectNode() {
					options.selectNode?.();
					nodeView.updateContext();
				},
				deselectNode() {
					options.deselectNode?.();
					nodeView.updateContext();
				},
				destroy() {
					options.destroy?.();
					removeVueRenderer(nodeView);
				}
			}
		});
		renderVueRenderer(nodeView);
		return nodeView;
	};
	return createVueNodeView;
}
//#endregion
//#region src/pluginView/useVuePluginViewCreator.ts
function useVuePluginViewCreator(renderVueRenderer, removeVueRenderer) {
	const createVuePluginView = (options) => (view) => {
		const pluginView = new VuePluginView({
			view,
			options: {
				...options,
				update: (view, prevState) => {
					options.update?.(view, prevState);
					pluginView.updateContext();
				},
				destroy: () => {
					options.destroy?.();
					removeVueRenderer(pluginView);
				}
			}
		});
		renderVueRenderer(pluginView);
		return pluginView;
	};
	return createVuePluginView;
}
//#endregion
//#region src/VueRenderer.ts
function useVueRenderer() {
	const portals = ref({});
	const instance = getCurrentInstance();
	const update = markRaw({});
	onBeforeMount(() => {
		update.updater = () => {
			instance?.update();
		};
	});
	onUnmounted(() => {
		update.updater = void 0;
	});
	const renderVueRenderer = (renderer) => {
		portals.value[renderer.key] = renderer.render();
		update.updater?.();
	};
	const removeVueRenderer = (renderer) => {
		delete portals.value[renderer.key];
	};
	return {
		portals,
		renderVueRenderer,
		removeVueRenderer
	};
}
//#endregion
//#region src/widgetView/widgetViewContext.ts
const widgetViewContext = Symbol("[ProsemirrorAdapter]widgetViewContext");
const useWidgetViewContext = () => inject(widgetViewContext);
const widgetViewFactoryKey = Symbol("[ProsemirrorAdapter]useWidgetViewFactory");
const useWidgetViewFactory = () => inject(widgetViewFactoryKey);
//#endregion
//#region src/widgetView/VueWidgetView.ts
var VueWidgetView = class extends CoreWidgetView {
	constructor(..._args) {
		super(..._args);
		this.key = nanoid();
		this.context = {
			view: this.view,
			getPos: this.getPos,
			spec: this.spec
		};
		this.updateContext = () => {
			Object.assign(this.context, {
				view: this.view,
				getPos: this.getPos,
				spec: this.spec
			});
		};
		this.render = () => {
			const UserComponent = this.component;
			return markRaw(defineComponent({
				name: "ProsemirrorWidgetView",
				setup: () => {
					provide(widgetViewContext, this.context);
					return () => h(Teleport, {
						key: this.key,
						to: this.dom
					}, [h(UserComponent)]);
				}
			}));
		};
	}
};
//#endregion
//#region src/widgetView/useVueWidgetViewCreator.ts
function useVueWidgetViewCreator(renderVueRenderer, removeVueRenderer) {
	const createWidgetPluginView = (options) => {
		return (pos, userSpec = {}) => {
			const widgetView = new VueWidgetView({
				pos,
				options
			});
			const spec = {
				...userSpec,
				destroy: (node) => {
					userSpec.destroy?.(node);
					removeVueRenderer(widgetView);
				}
			};
			widgetView.spec = spec;
			return Decoration.widget(pos, (view, getPos) => {
				widgetView.bind(view, getPos);
				widgetView.updateContext();
				renderVueRenderer(widgetView);
				return widgetView.dom;
			}, spec);
		};
	};
	return createWidgetPluginView;
}
//#endregion
//#region src/Provider.ts
const ProsemirrorAdapterProvider = defineComponent({
	name: "ProsemirrorAdapterProvider",
	setup: (_, { slots }) => {
		const { portals, renderVueRenderer, removeVueRenderer } = useVueRenderer();
		const createVueNodeView = useVueNodeViewCreator(renderVueRenderer, removeVueRenderer);
		const createVueMarkView = useVueMarkViewCreator(renderVueRenderer, removeVueRenderer);
		const createVuePluginView = useVuePluginViewCreator(renderVueRenderer, removeVueRenderer);
		const createVueWidgetView = useVueWidgetViewCreator(renderVueRenderer, removeVueRenderer);
		provide(nodeViewFactoryKey, createVueNodeView);
		provide(markViewFactoryKey, createVueMarkView);
		provide(pluginViewFactoryKey, createVuePluginView);
		provide(widgetViewFactoryKey, createVueWidgetView);
		return () => {
			return h(Fragment, null, [slots.default?.(), Object.values(portals.value).map((x) => h(x))]);
		};
	}
});
//#endregion
export { ProsemirrorAdapterProvider, VueMarkView, VueNodeView, VuePluginView, VueWidgetView, markViewContext, markViewFactoryKey, nodeViewContext, nodeViewFactoryKey, pluginViewContext, pluginViewFactoryKey, useMarkViewContext, useMarkViewFactory, useNodeViewContext, useNodeViewFactory, usePluginViewContext, usePluginViewFactory, useWidgetViewContext, useWidgetViewFactory, widgetViewContext, widgetViewFactoryKey };

//# sourceMappingURL=index.js.map
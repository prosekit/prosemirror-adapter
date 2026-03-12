import * as svelte from "svelte";
import { getAllContexts, getContext, setContext } from "svelte";
import { CoreMarkView, CoreNodeView, CorePluginView, CoreWidgetView } from "@prosemirror-adapter/core";
import { nanoid } from "nanoid";
import { writable } from "svelte/store";
import { Decoration } from "prosemirror-view";
//#region src/markView/markViewContext.ts
function useMarkViewContext(key) {
	return getContext(key);
}
const markViewFactoryKey = "[ProsemirrorAdapter]useMarkViewFactory";
const useMarkViewFactory = () => getContext(markViewFactoryKey);
//#endregion
//#region src/context.ts
function createContextMap(allContext, adapterContext) {
	return new Map([...allContext.entries(), ...Object.entries(adapterContext)]);
}
//#endregion
//#region src/mount.ts
const isSvelte5 = !!svelte.mount && !!svelte.flushSync;
function mountFunctionComponent(UserComponent, options) {
	const component = svelte.mount(UserComponent, { ...options });
	svelte.flushSync();
	return () => svelte.unmount(component);
}
function mountClassComponent(UserComponent, options) {
	const component = new UserComponent(options);
	return () => component.$destroy();
}
/**
* Mounts a Svelte component to a DOM element.
*
* Returns a function that unmounts the component.
*/
const mount = isSvelte5 ? mountFunctionComponent : mountClassComponent;
//#endregion
//#region src/markView/SvelteMarkView.ts
var SvelteMarkView = class extends CoreMarkView {
	constructor(..._args) {
		super(..._args);
		this.key = nanoid();
		this.context = {
			contentRef: (element) => {
				if (element && element instanceof HTMLElement && this.contentDOM && element.firstChild !== this.contentDOM) element.appendChild(this.contentDOM);
			},
			view: this.view,
			mark: writable(this.mark)
		};
		this.updateContext = () => {
			this.context.mark.set(this.mark);
		};
		this.render = (options) => {
			const UserComponent = this.component;
			const context = createContextMap(options.context, this.context);
			return mount(UserComponent, {
				target: this.dom,
				context
			});
		};
	}
};
//#endregion
//#region src/nodeView/nodeViewContext.ts
function useNodeViewContext(key) {
	return getContext(key);
}
const nodeViewFactoryKey = "[ProsemirrorAdapter]useNodeViewFactory";
const useNodeViewFactory = () => getContext(nodeViewFactoryKey);
//#endregion
//#region src/nodeView/SvelteNodeView.ts
var SvelteNodeView = class extends CoreNodeView {
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
			node: writable(this.node),
			selected: writable(this.selected),
			decorations: writable(this.decorations),
			innerDecorations: writable(this.innerDecorations)
		};
		this.updateContext = () => {
			this.context.node.set(this.node);
			this.context.selected.set(this.selected);
			this.context.decorations.set(this.decorations);
			this.context.innerDecorations.set(this.innerDecorations);
		};
		this.render = (options) => {
			const UserComponent = this.component;
			const context = createContextMap(options.context, this.context);
			return mount(UserComponent, {
				target: this.dom,
				context
			});
		};
	}
};
//#endregion
//#region src/pluginView/pluginViewContext.ts
function usePluginViewContext(key) {
	return getContext(key);
}
const pluginViewFactoryKey = "[ProsemirrorAdapter]usePluginViewFactory";
const usePluginViewFactory = () => getContext(pluginViewFactoryKey);
//#endregion
//#region src/pluginView/SveltePluginView.ts
var SveltePluginView = class extends CorePluginView {
	constructor(..._args) {
		super(..._args);
		this.key = nanoid();
		this.context = {
			view: writable(this.view),
			prevState: writable(this.prevState)
		};
		this.updateContext = () => {
			this.context.view.set(this.view);
			this.context.prevState.set(this.prevState);
		};
		this.render = (options) => {
			const UserComponent = this.component;
			const context = createContextMap(options.context, this.context);
			return mount(UserComponent, {
				target: this.root,
				context
			});
		};
	}
};
//#endregion
//#region src/markView/useSvelteMarkViewCreator.ts
function useSvelteMarkViewCreator(renderSvelteRenderer, removeSvelteRenderer) {
	const context = getAllContexts();
	const createSvelteMarkView = (options) => (mark, view, inline) => {
		const markView = new SvelteMarkView({
			mark,
			view,
			inline,
			options: {
				...options,
				destroy() {
					options.destroy?.();
					removeSvelteRenderer(markView);
				}
			}
		});
		renderSvelteRenderer(markView, { context });
		return markView;
	};
	return createSvelteMarkView;
}
//#endregion
//#region src/nodeView/useSvelteNodeViewCreator.ts
function useSvelteNodeViewCreator(renderSvelteRenderer, removeSvelteRenderer) {
	const context = getAllContexts();
	const createSvelteNodeView = (options) => (node, view, getPos, decorations, innerDecorations) => {
		const nodeView = new SvelteNodeView({
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
					removeSvelteRenderer(nodeView);
				}
			}
		});
		renderSvelteRenderer(nodeView, { context });
		return nodeView;
	};
	return createSvelteNodeView;
}
//#endregion
//#region src/pluginView/useSveltePluginViewCreator.ts
function useSveltePluginViewCreator(renderSvelteRenderer, removeSvelteRenderer) {
	const context = getAllContexts();
	const createSveltePluginView = (options) => (view) => {
		const pluginView = new SveltePluginView({
			view,
			options: {
				...options,
				update: (view, prevState) => {
					options.update?.(view, prevState);
					pluginView.updateContext();
				},
				destroy: () => {
					options.destroy?.();
					removeSvelteRenderer(pluginView);
				}
			}
		});
		renderSvelteRenderer(pluginView, { context });
		return pluginView;
	};
	return createSveltePluginView;
}
//#endregion
//#region src/SvelteRenderer.ts
function useSvelteRenderer() {
	const unmounts = writable({});
	const renderSvelteRenderer = (renderer, options) => {
		unmounts.update((records) => ({
			...records,
			[renderer.key]: renderer.render(options)
		}));
	};
	const removeSvelteRenderer = (renderer) => {
		unmounts.update((records) => {
			const { [renderer.key]: unmount, ...rest } = records;
			unmount?.();
			return rest;
		});
	};
	return {
		renderSvelteRenderer,
		removeSvelteRenderer
	};
}
//#endregion
//#region src/widgetView/SvelteWidgetView.ts
var SvelteWidgetView = class extends CoreWidgetView {
	constructor(..._args) {
		super(..._args);
		this.key = nanoid();
		this.context = {
			view: this.view,
			getPos: this.getPos,
			spec: this.spec
		};
		this.updateContext = () => {
			this.context.view = this.view;
			this.context.getPos = this.getPos;
			this.context.spec = this.spec;
		};
		this.render = (options) => {
			const UserComponent = this.component;
			const context = createContextMap(options.context, this.context);
			return mount(UserComponent, {
				target: this.dom,
				context
			});
		};
	}
};
//#endregion
//#region src/widgetView/widgetViewContext.ts
function useWidgetViewContext(key) {
	return getContext(key);
}
const widgetViewFactoryKey = "[ProsemirrorAdapter]useWidgetViewFactory";
const useWidgetViewFactory = () => getContext(widgetViewFactoryKey);
//#endregion
//#region src/widgetView/useSvelteWidgetViewCreator.ts
function useSvelteWidgetViewCreator(renderSvelteRenderer, removeSvelteRenderer) {
	const context = getAllContexts();
	const createWidgetPluginView = (options) => {
		return (pos, userSpec = {}) => {
			const widgetView = new SvelteWidgetView({
				pos,
				options
			});
			const spec = {
				...userSpec,
				destroy: (node) => {
					userSpec.destroy?.(node);
					removeSvelteRenderer(widgetView);
				}
			};
			widgetView.spec = spec;
			return Decoration.widget(pos, (view, getPos) => {
				widgetView.bind(view, getPos);
				widgetView.updateContext();
				renderSvelteRenderer(widgetView, { context });
				return widgetView.dom;
			}, spec);
		};
	};
	return createWidgetPluginView;
}
//#endregion
//#region src/Provider.ts
function useProsemirrorAdapterProvider() {
	const { renderSvelteRenderer, removeSvelteRenderer } = useSvelteRenderer();
	const createSvelteNodeView = useSvelteNodeViewCreator(renderSvelteRenderer, removeSvelteRenderer);
	const createSvelteMarkView = useSvelteMarkViewCreator(renderSvelteRenderer, removeSvelteRenderer);
	const createSveltePluginView = useSveltePluginViewCreator(renderSvelteRenderer, removeSvelteRenderer);
	const createSvelteWidgetView = useSvelteWidgetViewCreator(renderSvelteRenderer, removeSvelteRenderer);
	setContext(nodeViewFactoryKey, createSvelteNodeView);
	setContext(markViewFactoryKey, createSvelteMarkView);
	setContext(pluginViewFactoryKey, createSveltePluginView);
	setContext(widgetViewFactoryKey, createSvelteWidgetView);
}
//#endregion
export { SvelteMarkView, SvelteNodeView, SveltePluginView, SvelteWidgetView, markViewFactoryKey, nodeViewFactoryKey, pluginViewFactoryKey, useMarkViewContext, useMarkViewFactory, useNodeViewContext, useNodeViewFactory, usePluginViewContext, usePluginViewFactory, useProsemirrorAdapterProvider, useWidgetViewContext, useWidgetViewFactory, widgetViewFactoryKey };

//# sourceMappingURL=index.js.map
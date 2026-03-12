import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CoreMarkView, CoreNodeView, CorePluginView, CoreWidgetView } from "@prosemirror-adapter/core";
import { nanoid } from "nanoid";
import { createPortal, flushSync } from "react-dom";
import { jsx, jsxs } from "react/jsx-runtime";
import { Decoration } from "prosemirror-view";
//#region src/markView/markViewContext.ts
const markViewContext = createContext({
	contentRef: () => {},
	view: null,
	mark: null
});
const useMarkViewContext = () => useContext(markViewContext);
const createMarkViewContext = createContext((_options) => {
	throw new Error("No ProsemirrorAdapterProvider detected, maybe you need to wrap the component with the Editor with ProsemirrorAdapterProvider?");
});
const useMarkViewFactory = () => useContext(createMarkViewContext);
//#endregion
//#region src/markView/ReactMarkView.tsx
var ReactMarkView = class extends CoreMarkView {
	constructor(..._args) {
		super(..._args);
		this.key = nanoid();
		this.context = {
			contentRef: (element) => {
				if (element && this.contentDOM && element.firstChild !== this.contentDOM) element.appendChild(this.contentDOM);
			},
			view: this.view,
			mark: this.mark
		};
		this.updateContext = () => {
			Object.assign(this.context, { mark: this.mark });
		};
		this.render = () => {
			const UserComponent = this.component;
			return createPortal(/* @__PURE__ */ jsx(markViewContext.Provider, {
				value: this.context,
				children: /* @__PURE__ */ jsx(UserComponent, {})
			}), this.dom, this.key);
		};
	}
};
//#endregion
//#region src/nodeView/nodeViewContext.ts
const nodeViewContext = createContext({
	contentRef: () => {},
	view: null,
	getPos: () => 0,
	setAttrs: () => {},
	node: null,
	selected: false,
	decorations: [],
	innerDecorations: null
});
const useNodeViewContext = () => useContext(nodeViewContext);
const createNodeViewContext = createContext((_options) => {
	throw new Error("No ProsemirrorAdapterProvider detected, maybe you need to wrap the component with the Editor with ProsemirrorAdapterProvider?");
});
const useNodeViewFactory = () => useContext(createNodeViewContext);
//#endregion
//#region src/nodeView/ReactNodeView.tsx
var ReactNodeView = class extends CoreNodeView {
	constructor(..._args) {
		super(..._args);
		this.key = nanoid();
		this.context = {
			contentRef: (element) => {
				if (element && this.contentDOM && element.firstChild !== this.contentDOM) element.appendChild(this.contentDOM);
			},
			view: this.view,
			getPos: this.getPos,
			setAttrs: this.setAttrs,
			node: this.node,
			selected: this.selected,
			decorations: this.decorations,
			innerDecorations: this.innerDecorations
		};
		this.updateContext = () => {
			Object.assign(this.context, {
				node: this.node,
				selected: this.selected,
				decorations: this.decorations,
				innerDecorations: this.innerDecorations
			});
		};
		this.render = () => {
			const UserComponent = this.component;
			return createPortal(/* @__PURE__ */ jsx(nodeViewContext.Provider, {
				value: this.context,
				children: /* @__PURE__ */ jsx(UserComponent, {})
			}), this.dom, this.key);
		};
	}
};
//#endregion
//#region src/pluginView/pluginViewContext.ts
const pluginViewContext = createContext({ view: null });
const usePluginViewContext = () => useContext(pluginViewContext);
const createPluginViewContext = createContext((_options) => {
	throw new Error("out of scope");
});
const usePluginViewFactory = () => useContext(createPluginViewContext);
//#endregion
//#region src/pluginView/ReactPluginView.tsx
var ReactPluginView = class extends CorePluginView {
	constructor(..._args) {
		super(..._args);
		this.key = nanoid();
		this.context = {
			view: this.view,
			prevState: this.prevState
		};
		this.updateContext = () => {
			Object.assign(this.context, {
				view: this.view,
				prevState: this.prevState
			});
		};
		this.render = () => {
			const UserComponent = this.component;
			return createPortal(/* @__PURE__ */ jsx(pluginViewContext.Provider, {
				value: this.context,
				children: /* @__PURE__ */ jsx(UserComponent, {})
			}), this.root, this.key);
		};
	}
};
//#endregion
//#region src/markView/useReactMarkViewCreator.ts
function useReactMarkViewCreator(renderReactRenderer, removeReactRenderer) {
	return useCallback((options) => (mark, view, inline) => {
		const markView = new ReactMarkView({
			mark,
			view,
			inline,
			options: {
				...options,
				destroy() {
					options.destroy?.();
					removeReactRenderer(markView);
				}
			}
		});
		renderReactRenderer(markView, false);
		return markView;
	}, [removeReactRenderer, renderReactRenderer]);
}
//#endregion
//#region src/nodeView/useReactNodeViewCreator.ts
function useReactNodeViewCreator(renderReactRenderer, removeReactRenderer) {
	return useCallback((options) => (node, view, getPos, decorations, innerDecorations) => {
		const nodeView = new ReactNodeView({
			node,
			view,
			getPos,
			decorations,
			innerDecorations,
			options: {
				...options,
				onUpdate() {
					options.onUpdate?.();
					renderReactRenderer(nodeView);
				},
				selectNode() {
					options.selectNode?.();
					renderReactRenderer(nodeView);
				},
				deselectNode() {
					options.deselectNode?.();
					renderReactRenderer(nodeView);
				},
				destroy() {
					options.destroy?.();
					removeReactRenderer(nodeView);
				}
			}
		});
		renderReactRenderer(nodeView, false);
		return nodeView;
	}, [removeReactRenderer, renderReactRenderer]);
}
//#endregion
//#region src/pluginView/useReactPluginViewCreator.ts
function useReactPluginViewCreator(renderReactRenderer, removeReactRenderer) {
	return useCallback((options) => {
		return (view) => {
			const pluginView = new ReactPluginView({
				view,
				options: {
					...options,
					update: (view, prevState) => {
						options.update?.(view, prevState);
						renderReactRenderer(pluginView);
					},
					destroy: () => {
						options.destroy?.();
						removeReactRenderer(pluginView);
					}
				}
			});
			renderReactRenderer(pluginView, false);
			return pluginView;
		};
	}, [removeReactRenderer, renderReactRenderer]);
}
//#endregion
//#region src/ReactRenderer.ts
function useReactRenderer() {
	const [portals, setPortals] = useState({});
	const mountedRef = useRef(false);
	useLayoutEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);
	const maybeFlushSync = useCallback((fn) => {
		if (mountedRef.current) flushSync(fn);
		else fn();
	}, []);
	return {
		portals,
		renderReactRenderer: useCallback((nodeView, update = true) => {
			maybeFlushSync(() => {
				if (update) nodeView.updateContext();
				setPortals((prev) => ({
					...prev,
					[nodeView.key]: nodeView.render()
				}));
			});
		}, [maybeFlushSync]),
		removeReactRenderer: useCallback((nodeView) => {
			maybeFlushSync(() => {
				setPortals((prev) => {
					const next = { ...prev };
					delete next[nodeView.key];
					return next;
				});
			});
		}, [maybeFlushSync])
	};
}
//#endregion
//#region src/widgetView/widgetViewContext.ts
const widgetViewContext = createContext({
	view: null,
	getPos: () => void 0
});
const useWidgetViewContext = () => useContext(widgetViewContext);
const createWidgetViewContext = createContext((_options) => {
	throw new Error("out of scope");
});
const useWidgetViewFactory = () => useContext(createWidgetViewContext);
//#endregion
//#region src/widgetView/ReactWidgetView.tsx
var ReactWidgetView = class extends CoreWidgetView {
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
			return createPortal(/* @__PURE__ */ jsx(widgetViewContext.Provider, {
				value: this.context,
				children: /* @__PURE__ */ jsx(UserComponent, {})
			}), this.dom, this.key);
		};
	}
};
//#endregion
//#region src/widgetView/useReactWidgetViewCreator.ts
function useReactWidgetViewCreator(renderReactRenderer, removeReactRenderer) {
	return useCallback((options) => {
		return (pos, userSpec = {}) => {
			const widgetView = new ReactWidgetView({
				pos,
				options
			});
			const spec = {
				...userSpec,
				destroy: (node) => {
					userSpec.destroy?.(node);
					removeReactRenderer(widgetView);
				}
			};
			widgetView.spec = spec;
			return Decoration.widget(pos, (view, getPos) => {
				widgetView.bind(view, getPos);
				renderReactRenderer(widgetView);
				return widgetView.dom;
			}, spec);
		};
	}, [removeReactRenderer, renderReactRenderer]);
}
//#endregion
//#region src/Provider.tsx
const ProsemirrorAdapterProvider = ({ children }) => {
	const { renderReactRenderer, removeReactRenderer, portals } = useReactRenderer();
	const createReactNodeView = useReactNodeViewCreator(renderReactRenderer, removeReactRenderer);
	const createReactMarkView = useReactMarkViewCreator(renderReactRenderer, removeReactRenderer);
	const createReactPluginView = useReactPluginViewCreator(renderReactRenderer, removeReactRenderer);
	const createReactWidgetView = useReactWidgetViewCreator(renderReactRenderer, removeReactRenderer);
	const memoizedPortals = useMemo(() => Object.values(portals), [portals]);
	return /* @__PURE__ */ jsx(createNodeViewContext.Provider, {
		value: createReactNodeView,
		children: /* @__PURE__ */ jsx(createMarkViewContext.Provider, {
			value: createReactMarkView,
			children: /* @__PURE__ */ jsx(createPluginViewContext.Provider, {
				value: createReactPluginView,
				children: /* @__PURE__ */ jsxs(createWidgetViewContext.Provider, {
					value: createReactWidgetView,
					children: [children, memoizedPortals]
				})
			})
		})
	});
};
//#endregion
export { ProsemirrorAdapterProvider, ReactMarkView, ReactNodeView, ReactPluginView, ReactWidgetView, createMarkViewContext, createNodeViewContext, createPluginViewContext, createWidgetViewContext, markViewContext, nodeViewContext, pluginViewContext, useMarkViewContext, useMarkViewFactory, useNodeViewContext, useNodeViewFactory, usePluginViewContext, usePluginViewFactory, useWidgetViewContext, useWidgetViewFactory, widgetViewContext };

//# sourceMappingURL=index.js.map
import { createContext } from "preact";
import { useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import { CoreMarkView, CoreNodeView, CorePluginView, CoreWidgetView } from "@prosemirror-adapter/core";
import { nanoid } from "nanoid";
import { createPortal, flushSync } from "preact/compat";
import { jsx, jsxs } from "preact/jsx-runtime";
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
//#region src/markView/PreactMarkView.tsx
var PreactMarkView = class extends CoreMarkView {
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
			}), this.dom);
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
//#region src/nodeView/PreactNodeView.tsx
var PreactNodeView = class extends CoreNodeView {
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
			}), this.dom);
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
//#region src/pluginView/PreactPluginView.tsx
var PreactPluginView = class extends CorePluginView {
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
			}), this.root);
		};
	}
};
//#endregion
//#region src/markView/usePreactMarkViewCreator.ts
function usePreactMarkViewCreator(renderPreactRenderer, removePreactRenderer) {
	return useCallback((options) => (mark, view, inline) => {
		const markView = new PreactMarkView({
			mark,
			view,
			inline,
			options: {
				...options,
				destroy() {
					options.destroy?.();
					removePreactRenderer(markView);
				}
			}
		});
		renderPreactRenderer(markView, false);
		return markView;
	}, [removePreactRenderer, renderPreactRenderer]);
}
//#endregion
//#region src/nodeView/usePreactNodeViewCreator.ts
function usePreactNodeViewCreator(renderPreactRenderer, removePreactRenderer) {
	return useCallback((options) => (node, view, getPos, decorations, innerDecorations) => {
		const nodeView = new PreactNodeView({
			node,
			view,
			getPos,
			decorations,
			innerDecorations,
			options: {
				...options,
				onUpdate() {
					options.onUpdate?.();
					renderPreactRenderer(nodeView);
				},
				selectNode() {
					options.selectNode?.();
					renderPreactRenderer(nodeView);
				},
				deselectNode() {
					options.deselectNode?.();
					renderPreactRenderer(nodeView);
				},
				destroy() {
					options.destroy?.();
					removePreactRenderer(nodeView);
				}
			}
		});
		renderPreactRenderer(nodeView, false);
		return nodeView;
	}, [removePreactRenderer, renderPreactRenderer]);
}
//#endregion
//#region src/pluginView/usePreactPluginViewCreator.ts
function usePreactPluginViewCreator(renderPreactRenderer, removePreactRenderer) {
	return useCallback((options) => {
		return (view) => {
			const pluginView = new PreactPluginView({
				view,
				options: {
					...options,
					update: (view, prevState) => {
						options.update?.(view, prevState);
						renderPreactRenderer(pluginView);
					},
					destroy: () => {
						options.destroy?.();
						removePreactRenderer(pluginView);
					}
				}
			});
			renderPreactRenderer(pluginView, false);
			return pluginView;
		};
	}, [removePreactRenderer, renderPreactRenderer]);
}
//#endregion
//#region src/PreactRenderer.ts
function usePreactRenderer() {
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
		renderPreactRenderer: useCallback((nodeView, update = true) => {
			maybeFlushSync(() => {
				if (update) nodeView.updateContext();
				setPortals((prev) => ({
					...prev,
					[nodeView.key]: nodeView.render()
				}));
			});
		}, [maybeFlushSync]),
		removePreactRenderer: useCallback((nodeView) => {
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
//#region src/widgetView/PreactWidgetView.tsx
var PreactWidgetView = class extends CoreWidgetView {
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
			}), this.dom);
		};
	}
};
//#endregion
//#region src/widgetView/usePreactWidgetViewCreator.ts
function usePreactWidgetViewCreator(renderPreactRenderer, removePreactRenderer) {
	return useCallback((options) => {
		return (pos, userSpec = {}) => {
			const widgetView = new PreactWidgetView({
				pos,
				options
			});
			const spec = {
				...userSpec,
				destroy: (node) => {
					userSpec.destroy?.(node);
					removePreactRenderer(widgetView);
				}
			};
			widgetView.spec = spec;
			return Decoration.widget(pos, (view, getPos) => {
				widgetView.bind(view, getPos);
				renderPreactRenderer(widgetView);
				return widgetView.dom;
			}, spec);
		};
	}, [removePreactRenderer, renderPreactRenderer]);
}
//#endregion
//#region src/Provider.tsx
const ProsemirrorAdapterProvider = ({ children }) => {
	const { renderPreactRenderer, removePreactRenderer, portals } = usePreactRenderer();
	const createPreactNodeView = usePreactNodeViewCreator(renderPreactRenderer, removePreactRenderer);
	const createPreactMarkView = usePreactMarkViewCreator(renderPreactRenderer, removePreactRenderer);
	const createPreactPluginView = usePreactPluginViewCreator(renderPreactRenderer, removePreactRenderer);
	const createPreactWidgetView = usePreactWidgetViewCreator(renderPreactRenderer, removePreactRenderer);
	const memoizedPortals = useMemo(() => Object.values(portals), [portals]);
	return /* @__PURE__ */ jsx(createNodeViewContext.Provider, {
		value: createPreactNodeView,
		children: /* @__PURE__ */ jsx(createMarkViewContext.Provider, {
			value: createPreactMarkView,
			children: /* @__PURE__ */ jsx(createPluginViewContext.Provider, {
				value: createPreactPluginView,
				children: /* @__PURE__ */ jsxs(createWidgetViewContext.Provider, {
					value: createPreactWidgetView,
					children: [children, memoizedPortals]
				})
			})
		})
	});
};
//#endregion
export { PreactMarkView, PreactNodeView, PreactPluginView, PreactWidgetView, ProsemirrorAdapterProvider, createMarkViewContext, createNodeViewContext, createPluginViewContext, createWidgetViewContext, markViewContext, nodeViewContext, pluginViewContext, useMarkViewContext, useMarkViewFactory, useNodeViewContext, useNodeViewFactory, usePluginViewContext, usePluginViewFactory, useWidgetViewContext, useWidgetViewFactory, widgetViewContext };

//# sourceMappingURL=index.js.map
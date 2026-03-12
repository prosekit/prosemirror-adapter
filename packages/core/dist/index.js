//#region src/markView/CoreMarkView.ts
var CoreMarkView = class {
	#createElement(as) {
		const { inline, mark } = this;
		return as == null ? document.createElement(inline ? "span" : "div") : as instanceof HTMLElement ? as : typeof as === "function" ? as(mark) : document.createElement(as);
	}
	createDOM(as) {
		return this.#createElement(as);
	}
	createContentDOM(as) {
		return this.#createElement(as);
	}
	constructor({ mark, view, inline, options }) {
		this.shouldIgnoreMutation = (mutation) => {
			if (!this.dom || !this.contentDOM) return true;
			if (mutation.type === "selection") return false;
			if (this.contentDOM === mutation.target && mutation.type === "attributes") return true;
			if (this.contentDOM.contains(mutation.target)) return false;
			return true;
		};
		this.ignoreMutation = (mutation) => {
			if (!this.dom || !this.contentDOM) return true;
			let result;
			const userIgnoreMutation = this.options.ignoreMutation;
			if (userIgnoreMutation) result = userIgnoreMutation(mutation);
			if (typeof result !== "boolean") result = this.shouldIgnoreMutation(mutation);
			return result;
		};
		this.destroy = () => {
			this.options.destroy?.();
			this.dom.remove();
			this.contentDOM.remove();
		};
		this.mark = mark;
		this.view = view;
		this.inline = inline;
		this.options = options;
		this.dom = this.createDOM(options.as);
		this.contentDOM = this.createContentDOM(options.contentAs);
		this.dom.setAttribute("data-mark-view-root", "true");
		this.contentDOM.setAttribute("data-mark-view-content", "true");
		this.contentDOM.style.whiteSpace = "inherit";
	}
	get component() {
		return this.options.component;
	}
};
//#endregion
//#region src/nodeView/CoreNodeView.ts
var CoreNodeView = class {
	#createElement(as) {
		const { node } = this;
		return as == null ? document.createElement(node.isInline ? "span" : "div") : as instanceof HTMLElement ? as : typeof as === "function" ? as(node) : document.createElement(as);
	}
	createDOM(as) {
		return this.#createElement(as);
	}
	createContentDOM(as) {
		return this.#createElement(as);
	}
	constructor({ node, view, getPos, decorations, innerDecorations, options }) {
		this.selected = false;
		this.selectNode = () => {
			this.selected = true;
			this.options.selectNode?.();
		};
		this.deselectNode = () => {
			this.selected = false;
			this.options.deselectNode?.();
		};
		this.shouldUpdate = (node) => {
			return node.type === this.node.type;
		};
		this.update = (node, decorations, innerDecorations) => {
			const result = this.options.update?.(node, decorations, innerDecorations) ?? this.shouldUpdate(node);
			this.node = node;
			this.decorations = decorations;
			this.innerDecorations = innerDecorations;
			if (result) this.options.onUpdate?.();
			return result;
		};
		this.shouldIgnoreMutation = (mutation) => {
			if (!this.dom || !this.contentDOM) return true;
			if (this.node.isLeaf || this.node.isAtom) return true;
			if (mutation.type === "selection") return false;
			if (this.contentDOM === mutation.target && mutation.type === "attributes") return true;
			if (this.contentDOM.contains(mutation.target)) return false;
			return true;
		};
		this.ignoreMutation = (mutation) => {
			if (!this.dom || !this.contentDOM) return true;
			let result;
			const userIgnoreMutation = this.options.ignoreMutation;
			if (userIgnoreMutation) result = userIgnoreMutation(mutation);
			if (typeof result !== "boolean") result = this.shouldIgnoreMutation(mutation);
			return result;
		};
		this.destroy = () => {
			this.options.destroy?.();
			this.dom.remove();
			this.contentDOM?.remove();
		};
		this.setAttrs = (attr) => {
			const pos = this.getPos();
			if (typeof pos !== "number") return;
			return this.view.dispatch(this.view.state.tr.setNodeMarkup(pos, void 0, {
				...this.node.attrs,
				...attr
			}));
		};
		this.node = node;
		this.view = view;
		this.getPos = getPos;
		this.decorations = decorations;
		this.innerDecorations = innerDecorations;
		this.options = options;
		this.dom = this.createDOM(options.as);
		this.contentDOM = node.isLeaf ? null : this.createContentDOM(options.contentAs);
		this.dom.setAttribute("data-node-view-root", "true");
		if (this.contentDOM) {
			this.contentDOM.setAttribute("data-node-view-content", "true");
			this.contentDOM.style.whiteSpace = "inherit";
		}
		this.setSelection = options.setSelection;
		this.stopEvent = options.stopEvent;
	}
	get component() {
		return this.options.component;
	}
};
//#endregion
//#region src/pluginView/CorePluginView.ts
var CorePluginView = class {
	constructor(spec) {
		this.view = spec.view;
		this.options = spec.options;
	}
	get component() {
		return this.options.component;
	}
	get root() {
		let root = this.options.root?.(this.view.dom);
		if (!root) root = this.view.dom.parentElement ?? document.body;
		return root;
	}
	update(view, prevState) {
		this.view = view;
		this.prevState = prevState;
		this.options.update?.(view, prevState);
	}
	destroy() {
		this.options.destroy?.();
	}
};
//#endregion
//#region src/widgetView/CoreWidgetView.ts
var CoreWidgetView = class {
	#createElement(as) {
		return as instanceof HTMLElement ? as : document.createElement(as);
	}
	constructor({ pos, spec, options }) {
		this.pos = pos;
		this.options = options;
		this.spec = spec;
		this.dom = this.#createElement(options.as);
		this.dom.setAttribute("data-widget-view-root", "true");
	}
	bind(view, getPos) {
		this.view = view;
		this.getPos = getPos;
	}
	get component() {
		return this.options.component;
	}
};
//#endregion
export { CoreMarkView, CoreNodeView, CorePluginView, CoreWidgetView };

//# sourceMappingURL=index.js.map
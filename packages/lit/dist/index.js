import { createContext, ContextConsumer, ContextProvider } from "@lit/context";
import { CoreMarkView, CoreNodeView, CorePluginView, CoreWidgetView } from "@prosemirror-adapter/core";
import { nanoid } from "nanoid";
import { LitElement } from "lit";
import { Decoration } from "prosemirror-view";
const t$1 = (t2) => (e2, o2) => {
  void 0 !== o2 ? o2.addInitializer(() => {
    customElements.define(t2, e2);
  }) : customElements.define(t2, e2);
};
const t = globalThis, e$1 = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s = /* @__PURE__ */ Symbol(), o$1 = /* @__PURE__ */ new WeakMap();
let n$1 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$1 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$1.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$1.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$1 = (t2) => new n$1("string" == typeof t2 ? t2 : t2 + "", void 0, s), S = (s2, o2) => {
  if (e$1) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$1 = e$1 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$1(e2);
})(t2) : t2;
const { is: i, defineProperty: e, getOwnPropertyDescriptor: h, getOwnPropertyNames: r, getOwnPropertySymbols: o, getPrototypeOf: n2 } = Object, a = globalThis, c = a.trustedTypes, l = c ? c.emptyScript : "", p = a.reactiveElementPolyfillSupport, d = (t2, s2) => t2, u = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i2 = t2;
  switch (s2) {
    case Boolean:
      i2 = null !== t2;
      break;
    case Number:
      i2 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i2 = JSON.parse(t2);
      } catch (t3) {
        i2 = null;
      }
  }
  return i2;
} }, f = (t2, s2) => !i(t2, s2), b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
class y extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ??= []).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = b) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i2 = /* @__PURE__ */ Symbol(), h2 = this.getPropertyDescriptor(t2, i2, s2);
      void 0 !== h2 && e(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i2) {
    const { get: e2, set: r2 } = h(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get: e2, set(s3) {
      const h2 = e2?.call(this);
      r2?.call(this, s3), this.requestUpdate(t2, h2, i2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t2 = n2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t3 = this.properties, s2 = [...r(t3), ...o(t3)];
      for (const i2 of s2) this.createProperty(i2, t3[i2]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i2 = this._$Eu(t3, s2);
      void 0 !== i2 && this._$Eh.set(i2, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i2 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i2.unshift(c$1(s3));
    } else void 0 !== s2 && i2.push(c$1(s2));
    return i2;
  }
  static _$Eu(t2, s2) {
    const i2 = s2.attribute;
    return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t2) => t2(this));
  }
  addController(t2) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t2), void 0 !== this.renderRoot && this.isConnected && t2.hostConnected?.();
  }
  removeController(t2) {
    this._$EO?.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t2) => t2.hostConnected?.());
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t2) => t2.hostDisconnected?.());
  }
  attributeChangedCallback(t2, s2, i2) {
    this._$AK(t2, i2);
  }
  _$ET(t2, s2) {
    const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
    if (void 0 !== e2 && true === i2.reflect) {
      const h2 = (void 0 !== i2.converter?.toAttribute ? i2.converter : u).toAttribute(s2, i2.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    const i2 = this.constructor, e2 = i2._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i2.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== t3.converter?.fromAttribute ? t3.converter : u;
      this._$Em = e2;
      const r2 = h2.fromAttribute(s2, t3.type);
      this[e2] = r2 ?? this._$Ej?.get(e2) ?? r2, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i2, e2 = false, h2) {
    if (void 0 !== t2) {
      const r2 = this.constructor;
      if (false === e2 && (h2 = this[t2]), i2 ??= r2.getPropertyOptions(t2), !((i2.hasChanged ?? f)(h2, s2) || i2.useDefault && i2.reflect && h2 === this._$Ej?.get(t2) && !this.hasAttribute(r2._$Eu(t2, i2)))) return;
      this.C(t2, s2, i2);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i2, reflect: e2, wrapped: h2 }, r2) {
    i2 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i2 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i2] of t3) {
        const { wrapped: t4 } = i2, e2 = this[s3];
        true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i2, e2);
      }
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), this._$EO?.forEach((t3) => t3.hostUpdate?.()), this.update(s2)) : this._$EM();
    } catch (s3) {
      throw t2 = false, this._$EM(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    this._$EO?.forEach((t3) => t3.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Eq &&= this._$Eq.forEach((t3) => this._$ET(t3, this[t3])), this._$EM();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
}
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.2");
class ShallowLitElement extends LitElement {
  connectedCallback() {
    const result = super.connectedCallback();
    this.performUpdate();
    return result;
  }
  createRenderRoot() {
    return this;
  }
}
const markViewContextKey = createContext("[ProsemirrorAdapter]markViewContext");
function useMarkViewContext(element) {
  return new ContextConsumer(element, markViewContextKey, void 0, true);
}
const markViewFactoryKey = createContext("[ProsemirrorAdapter]useMarkViewFactory");
function useMarkViewFactory(element) {
  return new ContextConsumer(element, markViewFactoryKey, void 0, true);
}
var __create$4 = Object.create;
var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __knownSymbol$4 = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __typeError$4 = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name$4 = (target, value) => __defProp$4(target, "name", { value, configurable: true });
var __decoratorStart$4 = (base) => [, , , __create$4(base?.[__knownSymbol$4("metadata")] ?? null)];
var __decoratorStrings$4 = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn$4 = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError$4("Function expected") : fn;
var __decoratorContext$4 = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings$4[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError$4("Already initialized") : fns.push(__expectFn$4(fn || null)) });
var __decoratorMetadata$4 = (array, target) => __defNormalProp$4(target, __knownSymbol$4("metadata"), array[3]);
var __runInitializers$4 = (array, flags, self, value) => {
  for (var i2 = 0, fns = array[flags >> 1], n3 = fns && fns.length; i2 < n3; i2++) fns[i2].call(self);
  return value;
};
var __decorateElement$4 = (array, flags, name, decorators, target, extra) => {
  var it, done, ctx, k = flags & 7, p2 = false;
  var j = 0;
  var extraInitializers = array[j] || (array[j] = []);
  var desc = k && (target = target.prototype, k < 5 && (k > 3 || !p2) && __getOwnPropDesc$4(target, name));
  __name$4(target, name);
  for (var i2 = decorators.length - 1; i2 >= 0; i2--) {
    ctx = __decoratorContext$4(k, name, done = {}, array[3], extraInitializers);
    it = (0, decorators[i2])(target, ctx), done._ = 1;
    __expectFn$4(it) && (target = it);
  }
  return __decoratorMetadata$4(array, target), desc && __defProp$4(target, name, desc), p2 ? k ^ 4 ? extra : desc : target;
};
var _MarkViewDOMProvider_decorators, _init$4, _a$4;
_MarkViewDOMProvider_decorators = [t$1("mark-view-dom-provider")];
class MarkViewDOMProvider extends (_a$4 = ShallowLitElement) {
  constructor(markView) {
    super();
    this.markView = void 0;
    this.provider = void 0;
    this.create = () => {
      this.markView.dom.appendChild(this);
      const UserComponent = this.markView.component;
      const userComponent = new UserComponent();
      this.appendChild(userComponent);
      return userComponent;
    };
    this.updateContext = () => {
      this.provider.setValue(this.markView.context);
    };
    if (!markView) return;
    this.markView = markView;
    this.provider = new ContextProvider(this, markViewContextKey, this.markView.context);
  }
  createRenderRoot() {
    return this;
  }
}
_init$4 = __decoratorStart$4(_a$4);
MarkViewDOMProvider = __decorateElement$4(_init$4, 0, "MarkViewDOMProvider", _MarkViewDOMProvider_decorators, MarkViewDOMProvider);
__runInitializers$4(_init$4, 1, MarkViewDOMProvider);
class LitMarkView extends CoreMarkView {
  constructor() {
    super(...arguments);
    this.key = nanoid();
    this.context = {
      contentRef: (element) => {
        if (element && element instanceof HTMLElement && this.contentDOM && element.firstChild !== this.contentDOM) {
          element.appendChild(this.contentDOM);
        }
      },
      view: this.view,
      mark: this.mark
    };
    this.updateContext = () => {
      const next = {
        mark: this.mark
      };
      this.context = {
        ...this.context,
        ...next
      };
      this.provider?.updateContext();
    };
    this.render = () => {
      this.updateContext();
      this.provider = new MarkViewDOMProvider(this);
      return this.provider.create();
    };
  }
}
const nodeViewContextKey = createContext("[ProsemirrorAdapter]nodeViewContext");
function useNodeViewContext(element) {
  return new ContextConsumer(element, nodeViewContextKey, void 0, true);
}
const nodeViewFactoryKey = createContext("[ProsemirrorAdapter]useNodeViewFactory");
function useNodeViewFactory(element) {
  return new ContextConsumer(element, nodeViewFactoryKey, void 0, true);
}
var __create$3 = Object.create;
var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __knownSymbol$3 = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __typeError$3 = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name$3 = (target, value) => __defProp$3(target, "name", { value, configurable: true });
var __decoratorStart$3 = (base) => [, , , __create$3(base?.[__knownSymbol$3("metadata")] ?? null)];
var __decoratorStrings$3 = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn$3 = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError$3("Function expected") : fn;
var __decoratorContext$3 = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings$3[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError$3("Already initialized") : fns.push(__expectFn$3(fn || null)) });
var __decoratorMetadata$3 = (array, target) => __defNormalProp$3(target, __knownSymbol$3("metadata"), array[3]);
var __runInitializers$3 = (array, flags, self, value) => {
  for (var i2 = 0, fns = array[flags >> 1], n3 = fns && fns.length; i2 < n3; i2++) fns[i2].call(self);
  return value;
};
var __decorateElement$3 = (array, flags, name, decorators, target, extra) => {
  var it, done, ctx, k = flags & 7, p2 = false;
  var j = 0;
  var extraInitializers = array[j] || (array[j] = []);
  var desc = k && (target = target.prototype, k < 5 && (k > 3 || !p2) && __getOwnPropDesc$3(target, name));
  __name$3(target, name);
  for (var i2 = decorators.length - 1; i2 >= 0; i2--) {
    ctx = __decoratorContext$3(k, name, done = {}, array[3], extraInitializers);
    it = (0, decorators[i2])(target, ctx), done._ = 1;
    __expectFn$3(it) && (target = it);
  }
  return __decoratorMetadata$3(array, target), desc && __defProp$3(target, name, desc), p2 ? k ^ 4 ? extra : desc : target;
};
var _NodeViewDOMProvider_decorators, _init$3, _a$3;
_NodeViewDOMProvider_decorators = [t$1("node-view-dom-provider")];
class NodeViewDOMProvider extends (_a$3 = ShallowLitElement) {
  constructor(nodeView) {
    super();
    this.nodeView = void 0;
    this.provider = void 0;
    this.create = () => {
      this.nodeView.dom.appendChild(this);
      const UserComponent = this.nodeView.component;
      const userComponent = new UserComponent();
      this.appendChild(userComponent);
      return userComponent;
    };
    this.updateContext = () => {
      this.provider.setValue(this.nodeView.context);
    };
    if (!nodeView) return;
    this.nodeView = nodeView;
    this.provider = new ContextProvider(this, nodeViewContextKey, this.nodeView.context);
  }
  createRenderRoot() {
    return this;
  }
}
_init$3 = __decoratorStart$3(_a$3);
NodeViewDOMProvider = __decorateElement$3(_init$3, 0, "NodeViewDOMProvider", _NodeViewDOMProvider_decorators, NodeViewDOMProvider);
__runInitializers$3(_init$3, 1, NodeViewDOMProvider);
class LitNodeView extends CoreNodeView {
  constructor() {
    super(...arguments);
    this.key = nanoid();
    this.context = {
      contentRef: (element) => {
        if (element && element instanceof HTMLElement && this.contentDOM && element.firstChild !== this.contentDOM) {
          element.appendChild(this.contentDOM);
        }
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
      const next = {
        node: this.node,
        selected: this.selected,
        decorations: this.decorations,
        innerDecorations: this.innerDecorations
      };
      this.context = {
        ...this.context,
        ...next
      };
      this.provider?.updateContext();
    };
    this.render = () => {
      this.updateContext();
      this.provider = new NodeViewDOMProvider(this);
      return this.provider.create();
    };
  }
}
const pluginViewContextKey = createContext("[ProsemirrorAdapter]nodeViewContext");
function usePluginViewContext(element) {
  return new ContextConsumer(element, pluginViewContextKey, void 0, true);
}
const pluginViewFactoryKey = createContext("[ProsemirrorAdapter]usePluginViewFactory");
function usePluginViewFactory(element) {
  return new ContextConsumer(element, pluginViewFactoryKey, void 0, true);
}
var __create$2 = Object.create;
var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __knownSymbol$2 = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __typeError$2 = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name$2 = (target, value) => __defProp$2(target, "name", { value, configurable: true });
var __decoratorStart$2 = (base) => [, , , __create$2(base?.[__knownSymbol$2("metadata")] ?? null)];
var __decoratorStrings$2 = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn$2 = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError$2("Function expected") : fn;
var __decoratorContext$2 = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings$2[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError$2("Already initialized") : fns.push(__expectFn$2(fn || null)) });
var __decoratorMetadata$2 = (array, target) => __defNormalProp$2(target, __knownSymbol$2("metadata"), array[3]);
var __runInitializers$2 = (array, flags, self, value) => {
  for (var i2 = 0, fns = array[flags >> 1], n3 = fns && fns.length; i2 < n3; i2++) fns[i2].call(self);
  return value;
};
var __decorateElement$2 = (array, flags, name, decorators, target, extra) => {
  var it, done, ctx, k = flags & 7, p2 = false;
  var j = 0;
  var extraInitializers = array[j] || (array[j] = []);
  var desc = k && (target = target.prototype, k < 5 && (k > 3 || !p2) && __getOwnPropDesc$2(target, name));
  __name$2(target, name);
  for (var i2 = decorators.length - 1; i2 >= 0; i2--) {
    ctx = __decoratorContext$2(k, name, done = {}, array[3], extraInitializers);
    it = (0, decorators[i2])(target, ctx), done._ = 1;
    __expectFn$2(it) && (target = it);
  }
  return __decoratorMetadata$2(array, target), desc && __defProp$2(target, name, desc), p2 ? k ^ 4 ? extra : desc : target;
};
var _PluginViewDOMProvider_decorators, _init$2, _a$2;
_PluginViewDOMProvider_decorators = [t$1("plugin-view-dom-provider")];
class PluginViewDOMProvider extends (_a$2 = ShallowLitElement) {
  constructor(pluginView) {
    super();
    this.pluginView = void 0;
    this.provider = void 0;
    this.create = () => {
      this.pluginView.root.appendChild(this);
      const UserComponent = this.pluginView.component;
      const userComponent = new UserComponent();
      this.appendChild(userComponent);
      return userComponent;
    };
    this.updateContext = () => {
      this.provider.setValue(this.pluginView.context);
    };
    if (!pluginView) return;
    this.pluginView = pluginView;
    this.provider = new ContextProvider(this, pluginViewContextKey, this.pluginView.context);
  }
  createRenderRoot() {
    return this;
  }
}
_init$2 = __decoratorStart$2(_a$2);
PluginViewDOMProvider = __decorateElement$2(_init$2, 0, "PluginViewDOMProvider", _PluginViewDOMProvider_decorators, PluginViewDOMProvider);
__runInitializers$2(_init$2, 1, PluginViewDOMProvider);
class LitPluginView extends CorePluginView {
  constructor() {
    super(...arguments);
    this.key = nanoid();
    this.context = {
      view: this.view,
      prevState: this.prevState
    };
    this.updateContext = () => {
      const next = {
        view: this.view,
        prevState: this.prevState
      };
      this.context = {
        ...this.context,
        ...next
      };
      this.provider?.updateContext();
    };
    this.render = () => {
      this.updateContext();
      this.provider = new PluginViewDOMProvider(this);
      return this.provider.create();
    };
  }
}
function useLitRenderer() {
  const portals = /* @__PURE__ */ new Map();
  const renderLitRenderer = (renderer) => {
    const component = renderer.render();
    portals.set(renderer.key, component);
  };
  const removeLitRenderer = (renderer) => {
    portals.delete(renderer.key);
  };
  return {
    portals,
    renderLitRenderer,
    removeLitRenderer
  };
}
function useLitMarkViewCreator(renderLitRenderer, removeLitRenderer) {
  const createLitMarkView = (options) => (mark, view, inline) => {
    const markView = new LitMarkView({
      mark,
      view,
      inline,
      options: {
        ...options,
        destroy() {
          options.destroy?.();
          removeLitRenderer(markView);
        }
      }
    });
    renderLitRenderer(markView);
    return markView;
  };
  return createLitMarkView;
}
function useLitNodeViewCreator(renderLitRenderer, removeLitRenderer) {
  const createLitNodeView = (options) => (node, view, getPos, decorations, innerDecorations) => {
    const nodeView = new LitNodeView({
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
          removeLitRenderer(nodeView);
        }
      }
    });
    renderLitRenderer(nodeView);
    return nodeView;
  };
  return createLitNodeView;
}
function useLitPluginViewCreator(renderLitRenderer, removeLitRenderer) {
  const createLitPluginView = (options) => (view) => {
    const pluginView = new LitPluginView({
      view,
      options: {
        ...options,
        update: (view2, prevState) => {
          options.update?.(view2, prevState);
          pluginView.updateContext();
        },
        destroy: () => {
          options.destroy?.();
          removeLitRenderer(pluginView);
        }
      }
    });
    renderLitRenderer(pluginView);
    return pluginView;
  };
  return createLitPluginView;
}
const widgetViewContextKey = createContext("[ProsemirrorAdapter]widgetViewContext");
function useWidgetViewContext(element) {
  return new ContextConsumer(element, widgetViewContextKey, void 0, true);
}
const widgetViewFactoryKey = createContext("[ProsemirrorAdapter]useWidgetViewFactory");
function useWidgetViewFactory(element) {
  return new ContextConsumer(element, widgetViewFactoryKey, void 0, true);
}
var __create$1 = Object.create;
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __knownSymbol$1 = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __typeError$1 = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name$1 = (target, value) => __defProp$1(target, "name", { value, configurable: true });
var __decoratorStart$1 = (base) => [, , , __create$1(base?.[__knownSymbol$1("metadata")] ?? null)];
var __decoratorStrings$1 = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn$1 = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError$1("Function expected") : fn;
var __decoratorContext$1 = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings$1[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError$1("Already initialized") : fns.push(__expectFn$1(fn || null)) });
var __decoratorMetadata$1 = (array, target) => __defNormalProp$1(target, __knownSymbol$1("metadata"), array[3]);
var __runInitializers$1 = (array, flags, self, value) => {
  for (var i2 = 0, fns = array[flags >> 1], n3 = fns && fns.length; i2 < n3; i2++) fns[i2].call(self);
  return value;
};
var __decorateElement$1 = (array, flags, name, decorators, target, extra) => {
  var it, done, ctx, k = flags & 7, p2 = false;
  var j = 0;
  var extraInitializers = array[j] || (array[j] = []);
  var desc = k && (target = target.prototype, k < 5 && (k > 3 || !p2) && __getOwnPropDesc$1(target, name));
  __name$1(target, name);
  for (var i2 = decorators.length - 1; i2 >= 0; i2--) {
    ctx = __decoratorContext$1(k, name, done = {}, array[3], extraInitializers);
    it = (0, decorators[i2])(target, ctx), done._ = 1;
    __expectFn$1(it) && (target = it);
  }
  return __decoratorMetadata$1(array, target), desc && __defProp$1(target, name, desc), p2 ? k ^ 4 ? extra : desc : target;
};
var _WidgetViewDOMProvider_decorators, _init$1, _a$1;
_WidgetViewDOMProvider_decorators = [t$1("widget-view-dom-provider")];
class WidgetViewDOMProvider extends (_a$1 = ShallowLitElement) {
  constructor(widgetView) {
    super();
    this.widgetView = void 0;
    this.provider = void 0;
    this.create = () => {
      this.widgetView.dom.appendChild(this);
      const UserComponent = this.widgetView.component;
      const userComponent = new UserComponent();
      this.appendChild(userComponent);
      return userComponent;
    };
    this.updateContext = () => {
      this.provider.setValue(this.widgetView.context);
    };
    if (!widgetView) return;
    this.widgetView = widgetView;
    this.provider = new ContextProvider(this, widgetViewContextKey, this.widgetView.context);
  }
  createRenderRoot() {
    return this;
  }
}
_init$1 = __decoratorStart$1(_a$1);
WidgetViewDOMProvider = __decorateElement$1(_init$1, 0, "WidgetViewDOMProvider", _WidgetViewDOMProvider_decorators, WidgetViewDOMProvider);
__runInitializers$1(_init$1, 1, WidgetViewDOMProvider);
class LitWidgetView extends CoreWidgetView {
  constructor() {
    super(...arguments);
    this.key = nanoid();
    this.context = {
      view: this.view,
      getPos: this.getPos,
      spec: this.spec
    };
    this.updateContext = () => {
      const next = {
        view: this.view,
        getPos: this.getPos,
        spec: this.spec
      };
      this.context = {
        ...this.context,
        ...next
      };
    };
    this.render = () => {
      this.updateContext();
      this.provider = new WidgetViewDOMProvider(this);
      return this.provider.create();
    };
  }
}
function useLitWidgetViewCreator(renderLitRenderer, removeLitRenderer) {
  const createWidgetPluginView = (options) => {
    return (pos, userSpec = {}) => {
      const widgetView = new LitWidgetView({
        pos,
        options
      });
      const spec = {
        ...userSpec,
        destroy: (node) => {
          userSpec.destroy?.(node);
          removeLitRenderer(widgetView);
        }
      };
      widgetView.spec = spec;
      return Decoration.widget(
        pos,
        (view, getPos) => {
          widgetView.bind(view, getPos);
          widgetView.updateContext();
          renderLitRenderer(widgetView);
          return widgetView.dom;
        },
        spec
      );
    };
  };
  return createWidgetPluginView;
}
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i2 = 0, fns = array[flags >> 1], n3 = fns && fns.length; i2 < n3; i2++) fns[i2].call(self);
  return value;
};
var __decorateElement = (array, flags, name, decorators, target, extra) => {
  var it, done, ctx, k = flags & 7, p2 = false;
  var j = 0;
  var extraInitializers = array[j] || (array[j] = []);
  var desc = k && (target = target.prototype, k < 5 && (k > 3 || !p2) && __getOwnPropDesc(target, name));
  __name(target, name);
  for (var i2 = decorators.length - 1; i2 >= 0; i2--) {
    ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
    it = (0, decorators[i2])(target, ctx), done._ = 1;
    __expectFn(it) && (target = it);
  }
  return __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p2 ? k ^ 4 ? extra : desc : target;
};
var _ProsemirrorAdapterProvider_decorators, _init, _a;
_ProsemirrorAdapterProvider_decorators = [t$1("prosemirror-adapter-provider")];
class ProsemirrorAdapterProvider extends (_a = ShallowLitElement) {
  constructor() {
    super();
    const { renderLitRenderer, removeLitRenderer } = useLitRenderer();
    const createLitNodeView = useLitNodeViewCreator(renderLitRenderer, removeLitRenderer);
    const createLitMarkView = useLitMarkViewCreator(renderLitRenderer, removeLitRenderer);
    const createLitPluginView = useLitPluginViewCreator(renderLitRenderer, removeLitRenderer);
    const createLitWidgetView = useLitWidgetViewCreator(renderLitRenderer, removeLitRenderer);
    this.createLitNodeView = new ContextProvider(this, nodeViewFactoryKey, createLitNodeView);
    this.createLitMarkView = new ContextProvider(this, markViewFactoryKey, createLitMarkView);
    this.createLitPluginView = new ContextProvider(this, pluginViewFactoryKey, createLitPluginView);
    this.createLitWidgetView = new ContextProvider(this, widgetViewFactoryKey, createLitWidgetView);
  }
}
_init = __decoratorStart(_a);
ProsemirrorAdapterProvider = __decorateElement(_init, 0, "ProsemirrorAdapterProvider", _ProsemirrorAdapterProvider_decorators, ProsemirrorAdapterProvider);
__runInitializers(_init, 1, ProsemirrorAdapterProvider);
export {
  LitMarkView,
  LitNodeView,
  LitPluginView,
  LitWidgetView,
  MarkViewDOMProvider,
  NodeViewDOMProvider,
  PluginViewDOMProvider,
  ProsemirrorAdapterProvider,
  ShallowLitElement,
  WidgetViewDOMProvider,
  markViewContextKey,
  markViewFactoryKey,
  nodeViewContextKey,
  nodeViewFactoryKey,
  pluginViewContextKey,
  pluginViewFactoryKey,
  useMarkViewContext,
  useMarkViewFactory,
  useNodeViewContext,
  useNodeViewFactory,
  usePluginViewContext,
  usePluginViewFactory,
  useWidgetViewContext,
  useWidgetViewFactory,
  widgetViewContextKey,
  widgetViewFactoryKey
};

import { createContext, useContext, createMemo, getOwner, sharedConfig, createEffect, runWithOwner, createSignal, createRoot, onCleanup, splitProps, createRenderEffect, untrack, createComponent, For } from "solid-js";
import { CoreMarkView, CoreNodeView, CorePluginView, CoreWidgetView } from "@prosemirror-adapter/core";
import { nanoid } from "nanoid";
import { Decoration } from "prosemirror-view";
const markViewContext = createContext(() => ({
  contentRef: () => {
  },
  view: null,
  mark: null
}));
const useMarkViewContext = () => useContext(markViewContext);
const createMarkViewContext = createContext(
  (_options) => {
    throw new Error(
      "No ProsemirrorAdapterProvider detected, maybe you need to wrap the component with the Editor with ProsemirrorAdapterProvider?"
    );
  }
);
const useMarkViewFactory = () => useContext(createMarkViewContext);
const booleans = [
  "allowfullscreen",
  "async",
  "alpha",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "adauctionheaders",
  "browsingtopics",
  "credentialless",
  "defaultchecked",
  "defaultmuted",
  "defaultselected",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback",
  "preservespitch",
  "shadowrootclonable",
  "shadowrootcustomelementregistry",
  "shadowrootdelegatesfocus",
  "shadowrootserializable",
  "sharedstoragewritable"
];
const Properties = /* @__PURE__ */ new Set([
  "className",
  "value",
  "readOnly",
  "noValidate",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  "adAuctionHeaders",
  "allowFullscreen",
  "browsingTopics",
  "defaultChecked",
  "defaultMuted",
  "defaultSelected",
  "disablePictureInPicture",
  "disableRemotePlayback",
  "preservesPitch",
  "shadowRootClonable",
  "shadowRootCustomElementRegistry",
  "shadowRootDelegatesFocus",
  "shadowRootSerializable",
  "sharedStorageWritable",
  ...booleans
]);
const ChildProperties = /* @__PURE__ */ new Set(["innerHTML", "textContent", "innerText", "children"]);
const Aliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
});
const PropAliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  class: "className",
  novalidate: {
    $: "noValidate",
    FORM: 1
  },
  formnovalidate: {
    $: "formNoValidate",
    BUTTON: 1,
    INPUT: 1
  },
  ismap: {
    $: "isMap",
    IMG: 1
  },
  nomodule: {
    $: "noModule",
    SCRIPT: 1
  },
  playsinline: {
    $: "playsInline",
    VIDEO: 1
  },
  readonly: {
    $: "readOnly",
    INPUT: 1,
    TEXTAREA: 1
  },
  adauctionheaders: {
    $: "adAuctionHeaders",
    IFRAME: 1
  },
  allowfullscreen: {
    $: "allowFullscreen",
    IFRAME: 1
  },
  browsingtopics: {
    $: "browsingTopics",
    IMG: 1
  },
  defaultchecked: {
    $: "defaultChecked",
    INPUT: 1
  },
  defaultmuted: {
    $: "defaultMuted",
    AUDIO: 1,
    VIDEO: 1
  },
  defaultselected: {
    $: "defaultSelected",
    OPTION: 1
  },
  disablepictureinpicture: {
    $: "disablePictureInPicture",
    VIDEO: 1
  },
  disableremoteplayback: {
    $: "disableRemotePlayback",
    AUDIO: 1,
    VIDEO: 1
  },
  preservespitch: {
    $: "preservesPitch",
    AUDIO: 1,
    VIDEO: 1
  },
  shadowrootclonable: {
    $: "shadowRootClonable",
    TEMPLATE: 1
  },
  shadowrootdelegatesfocus: {
    $: "shadowRootDelegatesFocus",
    TEMPLATE: 1
  },
  shadowrootserializable: {
    $: "shadowRootSerializable",
    TEMPLATE: 1
  },
  sharedstoragewritable: {
    $: "sharedStorageWritable",
    IFRAME: 1,
    IMG: 1
  }
});
function getPropAlias(prop, tagName) {
  const a = PropAliases[prop];
  return typeof a === "object" ? a[tagName] ? a["$"] : void 0 : a;
}
const DelegatedEvents = /* @__PURE__ */ new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]);
const SVGElements = /* @__PURE__ */ new Set([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animate",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "hkern",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "set",
  "stop",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tref",
  "tspan",
  "use",
  "view",
  "vkern"
]);
const SVGNamespace = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};
const memo = (fn) => createMemo(() => fn());
function reconcileArrays(parentNode, a, b) {
  let bLength = b.length, aEnd = a.length, bEnd = bLength, aStart = 0, bStart = 0, after = a[aEnd - 1].nextSibling, map = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart])) a[aStart].remove();
        aStart++;
      }
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node);
      a[aEnd] = b[bEnd];
    } else {
      if (!map) {
        map = /* @__PURE__ */ new Map();
        let i = bStart;
        while (i < bEnd) map.set(b[i], i++);
      }
      const index = map.get(a[aStart]);
      if (index != null) {
        if (bStart < index && index < bEnd) {
          let i = aStart, sequence = 1, t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map.get(a[i])) == null || t !== index + sequence) break;
            sequence++;
          }
          if (sequence > index - bStart) {
            const node = a[aStart];
            while (bStart < index) parentNode.insertBefore(b[bStart++], node);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else a[aStart++].remove();
    }
  }
}
const $$EVENTS = "_$DX_DELEGATE";
function delegateEvents(eventNames, document2 = window.document) {
  const e = document2[$$EVENTS] || (document2[$$EVENTS] = /* @__PURE__ */ new Set());
  for (let i = 0, l = eventNames.length; i < l; i++) {
    const name = eventNames[i];
    if (!e.has(name)) {
      e.add(name);
      document2.addEventListener(name, eventHandler);
    }
  }
}
function setAttribute(node, name, value) {
  if (isHydrating(node)) return;
  if (value == null) node.removeAttribute(name);
  else node.setAttribute(name, value);
}
function setAttributeNS(node, namespace, name, value) {
  if (isHydrating(node)) return;
  if (value == null) node.removeAttributeNS(namespace, name);
  else node.setAttributeNS(namespace, name, value);
}
function setBoolAttribute(node, name, value) {
  if (isHydrating(node)) return;
  value ? node.setAttribute(name, "") : node.removeAttribute(name);
}
function className(node, value) {
  if (isHydrating(node)) return;
  if (value == null) node.removeAttribute("class");
  else node.className = value;
}
function addEventListener(node, name, handler, delegate) {
  if (delegate) {
    if (Array.isArray(handler)) {
      node[`$$${name}`] = handler[0];
      node[`$$${name}Data`] = handler[1];
    } else node[`$$${name}`] = handler;
  } else if (Array.isArray(handler)) {
    const handlerFn = handler[0];
    node.addEventListener(name, handler[0] = (e) => handlerFn.call(node, handler[1], e));
  } else node.addEventListener(name, handler, typeof handler !== "function" && handler);
}
function classList(node, value, prev = {}) {
  const classKeys = Object.keys(value || {}), prevKeys = Object.keys(prev);
  let i, len;
  for (i = 0, len = prevKeys.length; i < len; i++) {
    const key = prevKeys[i];
    if (!key || key === "undefined" || value[key]) continue;
    toggleClassKey(node, key, false);
    delete prev[key];
  }
  for (i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i], classValue = !!value[key];
    if (!key || key === "undefined" || prev[key] === classValue || !classValue) continue;
    toggleClassKey(node, key, true);
    prev[key] = classValue;
  }
  return prev;
}
function style(node, value, prev) {
  if (!value) return prev ? setAttribute(node, "style") : value;
  const nodeStyle = node.style;
  if (typeof value === "string") return nodeStyle.cssText = value;
  typeof prev === "string" && (nodeStyle.cssText = prev = void 0);
  prev || (prev = {});
  value || (value = {});
  let v, s;
  for (s in prev) {
    value[s] == null && nodeStyle.removeProperty(s);
    delete prev[s];
  }
  for (s in value) {
    v = value[s];
    if (v !== prev[s]) {
      nodeStyle.setProperty(s, v);
      prev[s] = v;
    }
  }
  return prev;
}
function spread(node, props = {}, isSVG, skipChildren) {
  const prevProps = {};
  {
    createRenderEffect(() => prevProps.children = insertExpression(node, props.children, prevProps.children));
  }
  createRenderEffect(() => typeof props.ref === "function" && use(props.ref, node));
  createRenderEffect(() => assign(node, props, isSVG, true, prevProps, true));
  return prevProps;
}
function use(fn, element, arg) {
  return untrack(() => fn(element, arg));
}
function insert(parent, accessor, marker, initial) {
  if (marker !== void 0 && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
  createRenderEffect((current) => insertExpression(parent, accessor(), current, marker), initial);
}
function assign(node, props, isSVG, skipChildren, prevProps = {}, skipRef = false) {
  props || (props = {});
  for (const prop in prevProps) {
    if (!(prop in props)) {
      if (prop === "children") continue;
      prevProps[prop] = assignProp(node, prop, null, prevProps[prop], isSVG, skipRef, props);
    }
  }
  for (const prop in props) {
    if (prop === "children") {
      continue;
    }
    const value = props[prop];
    prevProps[prop] = assignProp(node, prop, value, prevProps[prop], isSVG, skipRef, props);
  }
}
function getNextElement(template) {
  let node, key, hydrating = isHydrating();
  if (!hydrating || !(node = sharedConfig.registry.get(key = getHydrationKey()))) {
    return template();
  }
  if (sharedConfig.completed) sharedConfig.completed.add(node);
  sharedConfig.registry.delete(key);
  return node;
}
function isHydrating(node) {
  return !!sharedConfig.context && !sharedConfig.done && (!node || node.isConnected);
}
function toPropertyName(name) {
  return name.toLowerCase().replace(/-([a-z])/g, (_, w) => w.toUpperCase());
}
function toggleClassKey(node, key, value) {
  const classNames = key.trim().split(/\s+/);
  for (let i = 0, nameLen = classNames.length; i < nameLen; i++) node.classList.toggle(classNames[i], value);
}
function assignProp(node, prop, value, prev, isSVG, skipRef, props) {
  let isCE, isProp, isChildProp, propAlias, forceProp;
  if (prop === "style") return style(node, value, prev);
  if (prop === "classList") return classList(node, value, prev);
  if (value === prev) return prev;
  if (prop === "ref") {
    if (!skipRef) value(node);
  } else if (prop.slice(0, 3) === "on:") {
    const e = prop.slice(3);
    prev && node.removeEventListener(e, prev, typeof prev !== "function" && prev);
    value && node.addEventListener(e, value, typeof value !== "function" && value);
  } else if (prop.slice(0, 10) === "oncapture:") {
    const e = prop.slice(10);
    prev && node.removeEventListener(e, prev, true);
    value && node.addEventListener(e, value, true);
  } else if (prop.slice(0, 2) === "on") {
    const name = prop.slice(2).toLowerCase();
    const delegate = DelegatedEvents.has(name);
    if (!delegate && prev) {
      const h = Array.isArray(prev) ? prev[0] : prev;
      node.removeEventListener(name, h);
    }
    if (delegate || value) {
      addEventListener(node, name, value, delegate);
      delegate && delegateEvents([name]);
    }
  } else if (prop.slice(0, 5) === "attr:") {
    setAttribute(node, prop.slice(5), value);
  } else if (prop.slice(0, 5) === "bool:") {
    setBoolAttribute(node, prop.slice(5), value);
  } else if ((forceProp = prop.slice(0, 5) === "prop:") || (isChildProp = ChildProperties.has(prop)) || !isSVG && ((propAlias = getPropAlias(prop, node.tagName)) || (isProp = Properties.has(prop))) || (isCE = node.nodeName.includes("-") || "is" in props)) {
    if (forceProp) {
      prop = prop.slice(5);
      isProp = true;
    } else if (isHydrating(node)) return value;
    if (prop === "class" || prop === "className") className(node, value);
    else if (isCE && !isProp && !isChildProp) node[toPropertyName(prop)] = value;
    else node[propAlias || prop] = value;
  } else {
    const ns = isSVG && prop.indexOf(":") > -1 && SVGNamespace[prop.split(":")[0]];
    if (ns) setAttributeNS(node, ns, prop, value);
    else setAttribute(node, Aliases[prop] || prop, value);
  }
  return value;
}
function eventHandler(e) {
  if (sharedConfig.registry && sharedConfig.events) {
    if (sharedConfig.events.find(([el, ev]) => ev === e)) return;
  }
  let node = e.target;
  const key = `$$${e.type}`;
  const oriTarget = e.target;
  const oriCurrentTarget = e.currentTarget;
  const retarget = (value) => Object.defineProperty(e, "target", {
    configurable: true,
    value
  });
  const handleNode = () => {
    const handler = node[key];
    if (handler && !node.disabled) {
      const data = node[`${key}Data`];
      data !== void 0 ? handler.call(node, data, e) : handler.call(node, e);
      if (e.cancelBubble) return;
    }
    node.host && typeof node.host !== "string" && !node.host._$host && node.contains(e.target) && retarget(node.host);
    return true;
  };
  const walkUpTree = () => {
    while (handleNode() && (node = node._$host || node.parentNode || node.host)) ;
  };
  Object.defineProperty(e, "currentTarget", {
    configurable: true,
    get() {
      return node || document;
    }
  });
  if (sharedConfig.registry && !sharedConfig.done) sharedConfig.done = _$HY.done = true;
  if (e.composedPath) {
    const path = e.composedPath();
    retarget(path[0]);
    for (let i = 0; i < path.length - 2; i++) {
      node = path[i];
      if (!handleNode()) break;
      if (node._$host) {
        node = node._$host;
        walkUpTree();
        break;
      }
      if (node.parentNode === oriCurrentTarget) {
        break;
      }
    }
  } else walkUpTree();
  retarget(oriTarget);
}
function insertExpression(parent, value, current, marker, unwrapArray) {
  const hydrating = isHydrating(parent);
  if (hydrating) {
    !current && (current = [...parent.childNodes]);
    let cleaned = [];
    for (let i = 0; i < current.length; i++) {
      const node = current[i];
      if (node.nodeType === 8 && node.data.slice(0, 2) === "!$") node.remove();
      else cleaned.push(node);
    }
    current = cleaned;
  }
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value, multi = marker !== void 0;
  parent = multi && current[0] && current[0].parentNode || parent;
  if (t === "string" || t === "number") {
    if (hydrating) return current;
    if (t === "number") {
      value = value.toString();
      if (value === current) return current;
    }
    if (multi) {
      let node = current[0];
      if (node && node.nodeType === 3) {
        node.data !== value && (node.data = value);
      } else node = document.createTextNode(value);
      current = cleanChildren(parent, current, marker, node);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    if (hydrating) return current;
    current = cleanChildren(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect(() => {
      let v = value();
      while (typeof v === "function") v = v();
      current = insertExpression(parent, v, current, marker);
    });
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    const currentArray = current && Array.isArray(current);
    if (normalizeIncomingArray(array, value, current, unwrapArray)) {
      createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
      return () => current;
    }
    if (hydrating) {
      if (!array.length) return current;
      if (marker === void 0) return current = [...parent.childNodes];
      let node = array[0];
      if (node.parentNode !== parent) return current;
      const nodes = [node];
      while ((node = node.nextSibling) !== marker) nodes.push(node);
      return current = nodes;
    }
    if (array.length === 0) {
      current = cleanChildren(parent, current, marker);
      if (multi) return current;
    } else if (currentArray) {
      if (current.length === 0) {
        appendNodes(parent, array, marker);
      } else reconcileArrays(parent, current, array);
    } else {
      current && cleanChildren(parent);
      appendNodes(parent, array);
    }
    current = array;
  } else if (value.nodeType) {
    if (hydrating && value.parentNode) return current = multi ? [value] : value;
    if (Array.isArray(current)) {
      if (multi) return current = cleanChildren(parent, current, marker, value);
      cleanChildren(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else ;
  return current;
}
function normalizeIncomingArray(normalized, array, current, unwrap) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i], prev = current && current[normalized.length], t;
    if (item == null || item === true || item === false) ;
    else if ((t = typeof item) === "object" && item.nodeType) {
      normalized.push(item);
    } else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
    } else if (t === "function") {
      if (unwrap) {
        while (typeof item === "function") item = item();
        dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else {
      const value = String(item);
      if (prev && prev.nodeType === 3 && prev.data === value) normalized.push(prev);
      else normalized.push(document.createTextNode(value));
    }
  }
  return dynamic;
}
function appendNodes(parent, array, marker = null) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren(parent, current, marker, replacement) {
  if (marker === void 0) return parent.textContent = "";
  const node = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i) isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);
        else isParent && el.remove();
      } else inserted = true;
    }
  } else parent.insertBefore(node, marker);
  return [node];
}
function getHydrationKey() {
  return sharedConfig.getNextContextId();
}
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
function createElement(tagName, isSVG = false, is = void 0) {
  return isSVG ? document.createElementNS(SVG_NAMESPACE, tagName) : document.createElement(tagName, {
    is
  });
}
function Portal(props) {
  const {
    useShadow
  } = props, marker = document.createTextNode(""), mount = () => props.mount || document.body, owner = getOwner();
  let content;
  let hydrating = !!sharedConfig.context;
  createEffect(() => {
    if (hydrating) getOwner().user = hydrating = false;
    content || (content = runWithOwner(owner, () => createMemo(() => props.children)));
    const el = mount();
    if (el instanceof HTMLHeadElement) {
      const [clean, setClean] = createSignal(false);
      const cleanup = () => setClean(true);
      createRoot((dispose) => insert(el, () => !clean() ? content() : dispose(), null));
      onCleanup(cleanup);
    } else {
      const container = createElement(props.isSVG ? "g" : "div", props.isSVG), renderRoot = useShadow && container.attachShadow ? container.attachShadow({
        mode: "open"
      }) : container;
      Object.defineProperty(container, "_$host", {
        get() {
          return marker.parentNode;
        },
        configurable: true
      });
      insert(renderRoot, content);
      el.appendChild(container);
      props.ref && props.ref(container);
      onCleanup(() => el.removeChild(container));
    }
  }, void 0, {
    render: !hydrating
  });
  return marker;
}
function createDynamic(component, props) {
  const cached = createMemo(component);
  return createMemo(() => {
    const component2 = cached();
    switch (typeof component2) {
      case "function":
        return untrack(() => component2(props));
      case "string":
        const isSvg = SVGElements.has(component2);
        const el = sharedConfig.context ? getNextElement() : createElement(component2, isSvg, untrack(() => props.is));
        spread(el, props, isSvg);
        return el;
    }
  });
}
function Dynamic(props) {
  const [, others] = splitProps(props, ["component"]);
  return createDynamic(() => props.component, others);
}
const hidePortalDiv = (x) => x.style.display = "contents";
class SolidMarkView extends CoreMarkView {
  constructor(spec) {
    super(spec);
    this.key = nanoid();
    this.updateContext = () => {
      this.setContext((prev) => ({
        ...prev,
        mark: this.mark
      }));
    };
    this.render = () => {
      const _self$ = this;
      const UserComponent = this.component;
      return createComponent(Portal, {
        get mount() {
          return _self$.dom;
        },
        ref: (el) => hidePortalDiv(el),
        get children() {
          return createComponent(markViewContext.Provider, {
            get value() {
              return _self$.context;
            },
            get children() {
              return createComponent(Dynamic, {
                component: UserComponent
              });
            }
          });
        }
      });
    };
    const [context, setContext] = createSignal({
      contentRef: (element) => {
        if (element && this.contentDOM && element.firstChild !== this.contentDOM) {
          element.appendChild(this.contentDOM);
        }
      },
      view: this.view,
      mark: this.mark
    });
    this.context = context;
    this.setContext = setContext;
  }
}
const nodeViewContext = createContext(() => ({
  contentRef: () => {
  },
  view: null,
  getPos: () => 0,
  setAttrs: () => {
  },
  node: null,
  selected: false,
  decorations: [],
  innerDecorations: null
}));
const useNodeViewContext = () => useContext(nodeViewContext);
const createNodeViewContext = createContext(
  (_options) => {
    throw new Error(
      "No ProsemirrorAdapterProvider detected, maybe you need to wrap the component with the Editor with ProsemirrorAdapterProvider?"
    );
  }
);
const useNodeViewFactory = () => useContext(createNodeViewContext);
class SolidNodeView extends CoreNodeView {
  constructor(spec) {
    super(spec);
    this.key = nanoid();
    this.updateContext = () => {
      this.setContext((prev) => ({
        ...prev,
        node: this.node,
        selected: this.selected,
        decorations: this.decorations,
        innerDecorations: this.innerDecorations
      }));
    };
    this.render = () => {
      const _self$ = this;
      const UserComponent = this.component;
      return createComponent(Portal, {
        get mount() {
          return _self$.dom;
        },
        ref: (el) => hidePortalDiv(el),
        get children() {
          return createComponent(nodeViewContext.Provider, {
            get value() {
              return _self$.context;
            },
            get children() {
              return createComponent(Dynamic, {
                component: UserComponent
              });
            }
          });
        }
      });
    };
    const [context, setContext] = createSignal({
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
    });
    this.context = context;
    this.setContext = setContext;
  }
}
const pluginViewContext = createContext(() => ({
  view: null
}));
const usePluginViewContext = () => useContext(pluginViewContext);
const createPluginViewContext = createContext(
  (_options) => {
    throw new Error("out of scope");
  }
);
const usePluginViewFactory = () => useContext(createPluginViewContext);
class SolidPluginView extends CorePluginView {
  constructor(spec) {
    super(spec);
    this.key = nanoid();
    this.updateContext = () => {
      this.setContext(() => ({
        view: this.view,
        prevState: this.prevState
      }));
    };
    this.render = () => {
      const _self$ = this;
      const UserComponent = this.component;
      return createComponent(Portal, {
        get mount() {
          return _self$.root;
        },
        ref: (el) => hidePortalDiv(el),
        get children() {
          return createComponent(pluginViewContext.Provider, {
            get value() {
              return _self$.context;
            },
            get children() {
              return createComponent(Dynamic, {
                component: UserComponent
              });
            }
          });
        }
      });
    };
    const [context, setContext] = createSignal({
      view: this.view,
      prevState: this.prevState
    });
    this.context = context;
    this.setContext = setContext;
  }
}
function useSolidMarkViewCreator(renderSolidRenderer, removeSolidRenderer) {
  const createSolidMarkView = (options) => (mark, view, inline) => {
    const nodeView = new SolidMarkView({
      mark,
      view,
      inline,
      options: {
        ...options,
        destroy() {
          options.destroy?.();
          removeSolidRenderer(nodeView);
        }
      }
    });
    renderSolidRenderer(nodeView, false);
    return nodeView;
  };
  return createSolidMarkView;
}
function useSolidNodeViewCreator(renderSolidRenderer, removeSolidRenderer) {
  const createSolidNodeView = (options) => (node, view, getPos, decorations, innerDecorations) => {
    const nodeView = new SolidNodeView({
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
          removeSolidRenderer(nodeView);
        }
      }
    });
    renderSolidRenderer(nodeView, false);
    return nodeView;
  };
  return createSolidNodeView;
}
function useSolidPluginViewCreator(renderSolidRenderer, removeSolidRenderer) {
  const createSolidPluginView = (options) => {
    return (view) => {
      const pluginView = new SolidPluginView({
        view,
        options: {
          ...options,
          update: (view2, prevState) => {
            options.update?.(view2, prevState);
            pluginView.updateContext();
          },
          destroy: () => {
            options.destroy?.();
            removeSolidRenderer(pluginView);
          }
        }
      });
      renderSolidRenderer(pluginView);
      return pluginView;
    };
  };
  return createSolidPluginView;
}
function useSolidRenderer() {
  const [portals, setPortals] = createSignal({});
  const owner = getOwner();
  const renderSolidRenderer = (nodeView, update = true) => {
    if (update) nodeView.updateContext();
    setPortals((prev) => ({
      ...prev,
      [nodeView.key]: runWithOwner(owner, () => nodeView.render())
    }));
  };
  const removeSolidRenderer = (nodeView) => {
    setPortals((prev) => {
      const next = { ...prev };
      delete next[nodeView.key];
      return next;
    });
  };
  onCleanup(() => {
    setPortals({});
  });
  return {
    portals: portals(),
    renderSolidRenderer,
    removeSolidRenderer
  };
}
const widgetViewContext = createContext(() => ({
  view: null,
  getPos: () => void 0
}));
const useWidgetViewContext = () => useContext(widgetViewContext);
const createWidgetViewContext = createContext(
  (_options) => {
    throw new Error("out of scope");
  }
);
const useWidgetViewFactory = () => useContext(createWidgetViewContext);
class SolidWidgetView extends CoreWidgetView {
  constructor(spec) {
    super(spec);
    this.key = nanoid();
    this.updateContext = () => {
      this.setContext(() => ({
        view: this.view,
        getPos: this.getPos,
        spec: this.spec
      }));
    };
    this.render = () => {
      const _self$ = this;
      const UserComponent = this.component;
      return createComponent(Portal, {
        get mount() {
          return _self$.dom;
        },
        ref: (el) => hidePortalDiv(el),
        get children() {
          return createComponent(widgetViewContext.Provider, {
            get value() {
              return _self$.context;
            },
            get children() {
              return createComponent(Dynamic, {
                component: UserComponent
              });
            }
          });
        }
      });
    };
    const [context, setContext] = createSignal({
      view: this.view,
      getPos: this.getPos,
      spec: this.spec
    });
    this.context = context;
    this.setContext = setContext;
  }
}
function useSolidWidgetViewCreator(renderSolidRenderer, removeSolidRenderer) {
  const createWidgetPluginView = (options) => {
    return (pos, userSpec = {}) => {
      const widgetView = new SolidWidgetView({
        pos,
        options
      });
      const spec = {
        ...userSpec,
        destroy: (node) => {
          userSpec.destroy?.(node);
          removeSolidRenderer(widgetView);
        }
      };
      widgetView.spec = spec;
      return Decoration.widget(
        pos,
        (view, getPos) => {
          widgetView.bind(view, getPos);
          widgetView.updateContext();
          renderSolidRenderer(widgetView);
          return widgetView.dom;
        },
        spec
      );
    };
  };
  return createWidgetPluginView;
}
const ProsemirrorAdapterProvider = (props) => {
  const {
    renderSolidRenderer,
    removeSolidRenderer,
    portals
  } = useSolidRenderer();
  const createSolidNodeView = useSolidNodeViewCreator(renderSolidRenderer, removeSolidRenderer);
  const createSolidMarkView = useSolidMarkViewCreator(renderSolidRenderer, removeSolidRenderer);
  const createSolidWidgetView = useSolidWidgetViewCreator(renderSolidRenderer, removeSolidRenderer);
  const createSolidPluginView = useSolidPluginViewCreator(renderSolidRenderer, removeSolidRenderer);
  return createComponent(createNodeViewContext.Provider, {
    value: createSolidNodeView,
    get children() {
      return createComponent(createMarkViewContext.Provider, {
        value: createSolidMarkView,
        get children() {
          return createComponent(createWidgetViewContext.Provider, {
            value: createSolidWidgetView,
            get children() {
              return createComponent(createPluginViewContext.Provider, {
                value: createSolidPluginView,
                get children() {
                  return [memo(() => props.children), createComponent(For, {
                    get each() {
                      return Object.values(portals);
                    },
                    children: (portal) => portal
                  })];
                }
              });
            }
          });
        }
      });
    }
  });
};
export {
  ProsemirrorAdapterProvider,
  SolidMarkView,
  SolidNodeView,
  SolidPluginView,
  SolidWidgetView,
  createMarkViewContext,
  createNodeViewContext,
  createPluginViewContext,
  createWidgetViewContext,
  markViewContext,
  nodeViewContext,
  pluginViewContext,
  useMarkViewContext,
  useMarkViewFactory,
  useNodeViewContext,
  useNodeViewFactory,
  usePluginViewContext,
  usePluginViewFactory,
  useWidgetViewContext,
  useWidgetViewFactory,
  widgetViewContext
};

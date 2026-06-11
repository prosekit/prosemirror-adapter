import {
  createElement,
  forwardRef,
  Fragment,
  useLayoutEffect,
  useRef,
  type AriaAttributes,
  type AriaRole,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react'

import { useNodeViewContext } from './nodeViewContext'

type NodeViewStyle = CSSProperties & Record<`--${string}`, string | number | null | undefined>

type NodeViewDOMAttributeValue = string | number | boolean | null | undefined

type NodeViewDOMProps = AriaAttributes & {
  className?: string
  contentEditable?: boolean | 'true' | 'false' | 'inherit' | 'plaintext-only'
  dir?: string
  draggable?: boolean | 'true' | 'false'
  hidden?: boolean
  id?: string
  inert?: boolean
  inputMode?: string
  lang?: string
  part?: string
  role?: AriaRole
  slot?: string
  spellCheck?: boolean | 'true' | 'false'
  style?: NodeViewStyle
  tabIndex?: number
  title?: string
  translate?: 'yes' | 'no'
} & {
  [key: `data-${string}`]: NodeViewDOMAttributeValue
}

export interface NodeViewRootProps extends NodeViewDOMProps {
  children?: ReactNode
}

export interface NodeViewContentProps extends NodeViewDOMProps {}

function assignRef(ref: Ref<HTMLElement> | undefined, element: HTMLElement | null): void {
  if (!ref) return

  if (typeof ref === 'function') {
    ref(element)
  } else {
    ref.current = element
  }
}

function getAttributeName(name: string): string {
  if (name === 'className') return 'class'
  if (name === 'htmlFor') return 'for'
  if (name === 'tabIndex') return 'tabindex'
  return name
}

function isBooleanAttribute(name: string): boolean {
  return name === 'hidden' || name === 'inert'
}

function setAttribute(element: HTMLElement, name: string, value: unknown): void {
  if (value == null || value === false) {
    element.removeAttribute(getAttributeName(name))
    return
  }

  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
    element.removeAttribute(getAttributeName(name))
    return
  }

  const attributeName = getAttributeName(name)
  const attributeValue = value === true && isBooleanAttribute(name) ? '' : String(value)

  element.setAttribute(attributeName, attributeValue)
}

function getStylePropertyName(name: string): string {
  return name.startsWith('--') ? name : name.replaceAll(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

const UNITLESS_STYLE_PROPS = new Set([
  'animationIterationCount',
  'aspectRatio',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'columns',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'gridArea',
  'gridRow',
  'gridRowEnd',
  'gridRowSpan',
  'gridRowStart',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnSpan',
  'gridColumnStart',
  'fontWeight',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'scale',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
])

function getStyleValue(name: string, value: string | number): string {
  if (typeof value === 'number' && value !== 0 && !UNITLESS_STYLE_PROPS.has(name)) {
    return `${value}px`
  }

  return String(value)
}

function restoreAttribute(element: HTMLElement, name: string, value: string | null): void {
  const attributeName = getAttributeName(name)
  if (value == null) {
    element.removeAttribute(attributeName)
  } else {
    element.setAttribute(attributeName, value)
  }
}

function restoreStyle(element: HTMLElement, name: string, value: string): void {
  if (name.startsWith('--')) {
    if (value) {
      element.style.setProperty(name, value)
    } else {
      element.style.removeProperty(name)
    }
  } else {
    element.style[name as never] = value
  }
}

function setStyle(element: HTMLElement, style: NodeViewStyle | null | undefined): void {
  if (!style) return

  for (const [name, value] of Object.entries(style)) {
    if (value == null) {
      if (name.startsWith('--')) {
        element.style.removeProperty(name)
      } else {
        element.style[name as never] = ''
      }
    } else if (typeof value !== 'string' && typeof value !== 'number') {
      if (name.startsWith('--')) {
        element.style.removeProperty(name)
      } else {
        element.style[name as never] = ''
      }
    } else if (name.startsWith('--')) {
      element.style.setProperty(name, String(value))
    } else {
      element.style[name as never] = getStyleValue(name, value)
    }
  }
}

function restoreDOMAttrs(
  element: HTMLElement,
  originalAttrs: Map<string, string | null>,
  originalStyles: Map<string, string>,
): void {
  for (const [name, value] of originalAttrs) {
    restoreAttribute(element, name, value)
  }

  for (const [name, value] of originalStyles) {
    restoreStyle(element, name, value)
  }

  originalAttrs.clear()
  originalStyles.clear()
}

function restoreRemovedDOMAttrs(
  element: HTMLElement,
  prevAttrs: NodeViewDOMProps | null,
  attrs: NodeViewDOMProps,
  originalAttrs: Map<string, string | null>,
  originalStyles: Map<string, string>,
): void {
  if (!prevAttrs) return

  for (const name of Object.keys(prevAttrs)) {
    if (name === 'style') continue
    if (!(name in attrs) && originalAttrs.has(name)) {
      restoreAttribute(element, name, originalAttrs.get(name) ?? null)
      originalAttrs.delete(name)
    }
  }

  for (const name of Object.keys(prevAttrs.style ?? {})) {
    if (!attrs.style || !(name in attrs.style)) {
      restoreStyle(element, name, originalStyles.get(name) ?? '')
      originalStyles.delete(name)
    }
  }
}

function saveOriginalDOMAttrs(
  element: HTMLElement,
  attrs: NodeViewDOMProps,
  originalAttrs: Map<string, string | null>,
  originalStyles: Map<string, string>,
): void {
  for (const name of Object.keys(attrs)) {
    if (name === 'style') continue
    if (!originalAttrs.has(name)) {
      originalAttrs.set(name, element.getAttribute(getAttributeName(name)))
    }
  }

  for (const name of Object.keys(attrs.style ?? {})) {
    if (!originalStyles.has(name)) {
      originalStyles.set(name, element.style.getPropertyValue(getStylePropertyName(name)))
    }
  }
}

function useDOMAttrs(
  element: HTMLElement | null,
  attrs: NodeViewDOMProps,
  ref: Ref<HTMLElement> | undefined,
): void {
  const prevAttrsRef = useRef<NodeViewDOMProps | null>(null)
  const originalAttrsRef = useRef(new Map<string, string | null>())
  const originalStylesRef = useRef(new Map<string, string>())

  useLayoutEffect(() => {
    const originalAttrs = originalAttrsRef.current
    const originalStyles = originalStylesRef.current

    return () => {
      if (element) {
        restoreDOMAttrs(element, originalAttrs, originalStyles)
      }
    }
  }, [element])

  useLayoutEffect(() => {
    assignRef(ref, element)

    const prevAttrs = prevAttrsRef.current

    if (element) {
      restoreRemovedDOMAttrs(element, prevAttrs, attrs, originalAttrsRef.current, originalStylesRef.current)
      saveOriginalDOMAttrs(element, attrs, originalAttrsRef.current, originalStylesRef.current)

      for (const [name, value] of Object.entries(attrs)) {
        if (name === 'style') continue
        setAttribute(element, name, value)
      }

      setStyle(element, attrs.style)
    }

    prevAttrsRef.current = attrs

    return () => {
      assignRef(ref, null)
    }
  })
}

export const NodeViewRoot = forwardRef<HTMLElement, NodeViewRootProps>((props, ref) => {
  const { children, ...attrs } = props
  const { rootDOM } = useNodeViewContext()

  useDOMAttrs(rootDOM, attrs, ref)

  return createElement(Fragment, null, children)
})

NodeViewRoot.displayName = 'NodeViewRoot'

export const NodeViewContent = forwardRef<HTMLElement, NodeViewContentProps>((props, ref) => {
  const { children, ...attrs } = props as NodeViewContentProps & { children?: ReactNode }
  const { contentDOM, mountContentDOM } = useNodeViewContext()
  const didWarnChildrenRef = useRef(false)

  useDOMAttrs(contentDOM, attrs, ref)

  useLayoutEffect(() => {
    if (children != null && !didWarnChildrenRef.current) {
      didWarnChildrenRef.current = true
      console.warn('[prosemirror-adapter] NodeViewContent does not render children. Put custom UI next to it instead.')
    }
  })

  return createElement('span', {
    'data-node-view-content-anchor': 'true',
    ref: (element: HTMLElement | null) => {
      mountContentDOM(element, 'component')
    },
    style: { display: 'contents' },
  })
})

NodeViewContent.displayName = 'NodeViewContent'

import type { ReactElement, ReactPortal } from 'react'
import { createElement, Fragment, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

/**
 * @internal
 */
export interface ReactRenderer<Context> {
  key: string

  context: Context

  render: () => ReactPortal

  updateContext: () => void
}

/**
 * @internal
 */
export interface ReactRendererResult {
  readonly portal: ReactElement
  readonly renderReactRenderer: (nodeView: ReactRenderer<unknown>, update?: boolean) => void
  readonly removeReactRenderer: (nodeView: ReactRenderer<unknown>) => void
}

type PortalState = [keys: string[], nodes: ReactElement[]]

function updateRenderer(state: PortalState, renderer: ReactRenderer<unknown>): PortalState {
  const [keys, nodes] = state
  const newKey = renderer.key
  const newNode: ReactElement = createElement(Fragment, { key: newKey }, renderer.render())

  const index = keys.indexOf(newKey)
  if (index === -1) {
    return [
      [...keys, newKey],
      [...nodes, newNode],
    ]
  } else {
    const newNodes = [...nodes]
    newNodes[index] = newNode
    return [keys, newNodes]
  }
}

function removeRenderer(state: PortalState, renderer: ReactRenderer<unknown>): PortalState {
  const [keys, nodes] = state
  const index = keys.indexOf(renderer.key)
  if (index === -1) return state
  const newKeys = [...keys]
  const newNodes = [...nodes]
  newKeys.splice(index, 1)
  newNodes.splice(index, 1)
  return [newKeys, newNodes]
}

/**
 * @internal
 */
export function useReactRenderer(): ReactRendererResult {
  const [portalState, setPortalState] = useState<PortalState>([[], []])
  const mountedRef = useRef(false)

  useLayoutEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const maybeFlushSync = useCallback((fn: () => void) => {
    if (mountedRef.current) flushSync(fn)
    else fn()
  }, [])

  const renderReactRenderer = useCallback(
    (nodeView: ReactRenderer<unknown>, update = true) => {
      maybeFlushSync(() => {
        if (update) nodeView.updateContext()
        return setPortalState((prev) => updateRenderer(prev, nodeView))
      })
    },
    [maybeFlushSync],
  )

  const removeReactRenderer = useCallback(
    (nodeView: ReactRenderer<unknown>) => {
      maybeFlushSync(() => {
        return setPortalState((prev) => removeRenderer(prev, nodeView))
      })
    },
    [maybeFlushSync],
  )

  const nodes = portalState[1]
  const portal = useMemo(() => {
    return createElement(Fragment, null, nodes)
  }, [nodes])

  return {
    portal,
    renderReactRenderer,
    removeReactRenderer,
  } as const
}

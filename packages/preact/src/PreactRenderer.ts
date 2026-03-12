import type { VNode } from 'preact'
import { createElement, flushSync, Fragment } from 'preact/compat'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks'

/**
 * @internal
 */
export interface PreactRenderer<Context> {
  key: string

  context: Context

  render: () => VNode

  updateContext: () => void
}

/**
 * @internal
 */
export interface PreactRendererResult {
  readonly portal: VNode
  readonly renderPreactRenderer: (nodeView: PreactRenderer<unknown>, update?: boolean) => void
  readonly removePreactRenderer: (nodeView: PreactRenderer<unknown>) => void
}

type PortalState = [keys: string[], nodes: VNode[]]

function updateRenderer(state: PortalState, renderer: PreactRenderer<unknown>): PortalState {
  const [keys, nodes] = state
  const newKey = renderer.key
  const newNode: VNode = createElement(Fragment, { key: newKey }, renderer.render())

  const index = keys.indexOf(newKey)
  if (index === -1) {
    return [
      [...keys, newKey],
      [...nodes, newNode],
    ]
  } else {
    const newKeys = [...keys]
    const newNodes = [...nodes]
    newKeys[index] = newKey
    newNodes[index] = newNode
    return [newKeys, newNodes]
  }
}

function removeRenderer(state: PortalState, renderer: PreactRenderer<unknown>): PortalState {
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
export function usePreactRenderer(): PreactRendererResult {
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

  const renderPreactRenderer = useCallback(
    (nodeView: PreactRenderer<unknown>, update = true) => {
      maybeFlushSync(() => {
        if (update) nodeView.updateContext()
        return setPortalState((prev) => updateRenderer(prev, nodeView))
      })
    },
    [maybeFlushSync],
  )

  const removePreactRenderer = useCallback(
    (nodeView: PreactRenderer<unknown>) => {
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
    renderPreactRenderer,
    removePreactRenderer,
  } as const
}

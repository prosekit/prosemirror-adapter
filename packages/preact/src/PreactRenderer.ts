import type { VNode } from 'preact'
import { flushSync } from 'preact/compat'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

export interface PreactRenderer<Context> {
  key: string

  context: Context

  render: () => VNode

  updateContext: () => void
}

export interface PreactRendererResult {
  readonly portals: Record<string, VNode>
  readonly renderPreactRenderer: (nodeView: PreactRenderer<unknown>, update?: boolean) => void
  readonly removePreactRenderer: (nodeView: PreactRenderer<unknown>) => void
}

export function usePreactRenderer(): PreactRendererResult {
  const [portals, setPortals] = useState<Record<string, VNode>>({})
  const mountedRef = useRef(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      mountedRef.current = true
    })
    return () => {
      cancelAnimationFrame(id)
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

        setPortals((prev) => ({
          ...prev,
          [nodeView.key]: nodeView.render(),
        }))
      })
    },
    [maybeFlushSync],
  )

  const removePreactRenderer = useCallback(
    (nodeView: PreactRenderer<unknown>) => {
      maybeFlushSync(() => {
        setPortals((prev) => {
          const next = { ...prev }
          delete next[nodeView.key]
          return next
        })
      })
    },
    [maybeFlushSync],
  )

  return {
    portals,
    renderPreactRenderer,
    removePreactRenderer,
  } as const
}

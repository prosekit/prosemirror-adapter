import type { ComponentChild } from 'preact'
import { useCallback, useState } from 'preact/hooks'

export interface PreactRenderer<Context> {
  key: string

  context: Context

  render: () => ComponentChild

  updateContext: () => void
}

export interface PreactRendererResult {
  readonly portals: Record<string, ComponentChild>
  readonly renderPreactRenderer: (nodeView: PreactRenderer<unknown>, update?: boolean) => void
  readonly removePreactRenderer: (nodeView: PreactRenderer<unknown>) => void
}

export function usePreactRenderer(): PreactRendererResult {
  const [portals, setPortals] = useState<Record<string, ComponentChild>>({})

  const renderPreactRenderer = useCallback((nodeView: PreactRenderer<unknown>, update = true) => {
    if (update) nodeView.updateContext()

    setPortals((prev) => ({
      ...prev,
      [nodeView.key]: nodeView.render(),
    }))
  }, [])

  const removePreactRenderer = useCallback((nodeView: PreactRenderer<unknown>) => {
    setPortals((prev) => {
      const next = { ...prev }
      delete next[nodeView.key]
      return next
    })
  }, [])

  return {
    portals,
    renderPreactRenderer,
    removePreactRenderer,
  } as const
}

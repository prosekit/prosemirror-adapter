import type { JSX } from 'solid-js'
import { createSignal, getOwner, onCleanup, runWithOwner } from 'solid-js'

export interface SolidRenderer<Context> {
  key: string
  context: Context
  render: () => JSX.Element
  updateContext: () => void
}

export interface SolidRendererResult {
  readonly portals: Record<string, JSX.Element>
  readonly renderSolidRenderer: (nodeView: SolidRenderer<unknown>, update?: boolean) => void
  readonly removeSolidRenderer: (nodeView: SolidRenderer<unknown>) => void
}

export function useSolidRenderer(): SolidRendererResult {
  const [portals, setPortals] = createSignal<Record<string, JSX.Element>>({})
  const owner = getOwner()
  const renderSolidRenderer = (nodeView: SolidRenderer<unknown>, update = true) => {
    if (update) nodeView.updateContext()

    setPortals((prev) => ({
      ...prev,
      [nodeView.key]: runWithOwner(owner, () => nodeView.render()),
    }))
  }

  const removeSolidRenderer = (nodeView: SolidRenderer<unknown>) => {
    setPortals((prev) => {
      const next = { ...prev }
      delete next[nodeView.key]
      return next
    })
  }

  onCleanup(() => {
    setPortals({})
  })

  return {
    portals: portals(),
    renderSolidRenderer,
    removeSolidRenderer,
  } as const
}

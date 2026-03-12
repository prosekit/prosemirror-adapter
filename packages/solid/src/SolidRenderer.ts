import type { Accessor, JSX } from 'solid-js'
import { createMemo, createSignal, getOwner, onCleanup, runWithOwner } from 'solid-js'

/**
 * @internal
 */
export interface SolidRenderer<Context> {
  key: string
  context: Context
  render: () => JSX.Element
  updateContext: () => void
}

/**
 * @internal
 */
export interface SolidRendererResult {
  readonly render: Accessor<JSX.Element[]>
  readonly renderSolidRenderer: (nodeView: SolidRenderer<unknown>, update?: boolean) => void
  readonly removeSolidRenderer: (nodeView: SolidRenderer<unknown>) => void
}

type PortalState = [keys: string[], nodes: JSX.Element[]]

function updateRenderer(state: PortalState, renderer: SolidRenderer<unknown>): PortalState {
  const [keys, nodes] = state
  const newKey = renderer.key
  const newNode = renderer.render()

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

function removeRenderer(state: PortalState, renderer: SolidRenderer<unknown>): PortalState {
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
export function useSolidRenderer(): SolidRendererResult {
  const [portalState, setPortalState] = createSignal<PortalState>([[], []])
  const owner = getOwner()

  const renderSolidRenderer = (nodeView: SolidRenderer<unknown>, update = true) => {
    if (update) nodeView.updateContext()
    setPortalState((prev) => runWithOwner(owner, () => updateRenderer(prev, nodeView))!)
  }

  const removeSolidRenderer = (nodeView: SolidRenderer<unknown>) => {
    setPortalState((prev) => removeRenderer(prev, nodeView))
  }

  onCleanup(() => {
    setPortalState([[], []])
  })

  const render = createMemo(() => portalState()[1])

  return {
    render,
    renderSolidRenderer,
    removeSolidRenderer,
  } as const
}

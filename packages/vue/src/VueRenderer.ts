import type { ComputedRef, DefineComponent, VNode } from 'vue'
import { computed, Fragment, getCurrentInstance, h, markRaw, onBeforeMount, onUnmounted, shallowRef } from 'vue'

/**
 * @internal
 */
export type VueRendererComponent = DefineComponent<any, any, any>

/**
 * @internal
 */
export interface VueRenderer<Context> {
  key: string

  context: Context

  render: () => VueRendererComponent

  updateContext: () => void
}

/**
 * @internal
 */
export interface VueRendererResult {
  readonly portal: ComputedRef<VNode>
  readonly renderVueRenderer: (renderer: VueRenderer<unknown>) => void
  readonly removeVueRenderer: (renderer: VueRenderer<unknown>) => void
}

type PortalState = [keys: string[], nodes: VNode[]]

function updateRenderer(state: PortalState, renderer: VueRenderer<unknown>): PortalState {
  const [keys, nodes] = state
  const newKey = renderer.key
  const newNode: VNode = h(renderer.render(), { key: newKey })

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

function removeRenderer(state: PortalState, renderer: VueRenderer<unknown>): PortalState {
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
export function useVueRenderer(): VueRendererResult {
  const portalState = shallowRef<PortalState>([[], []])
  const instance = getCurrentInstance()
  const update = markRaw<{ updater?: () => void }>({})

  onBeforeMount(() => {
    update.updater = () => {
      instance?.update()
    }
  })

  onUnmounted(() => {
    update.updater = undefined
  })

  const renderVueRenderer = (renderer: VueRenderer<unknown>) => {
    portalState.value = updateRenderer(portalState.value, renderer)

    // Force update the vue component to render
    // Cursor won't move to new node without this
    update.updater?.()
  }

  const removeVueRenderer = (renderer: VueRenderer<unknown>) => {
    portalState.value = removeRenderer(portalState.value, renderer)
  }

  const portal = computed(() => {
    const nodes = portalState.value[1]
    return h(Fragment, null, nodes)
  })

  return {
    portal,
    renderVueRenderer,
    removeVueRenderer,
  } as const
}

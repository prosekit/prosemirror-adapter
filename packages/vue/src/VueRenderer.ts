import type { DefineComponent, VNode } from 'vue'
import { getCurrentInstance, h, markRaw, onBeforeMount, onUnmounted, shallowRef } from 'vue'

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

type PortalState = [keys: string[], components: VueRendererComponent[]]

function updateRenderer(state: PortalState, renderer: VueRenderer<unknown>): PortalState {
  const [keys, components] = state
  const newKey = renderer.key
  const newComponent = renderer.render()

  const index = keys.indexOf(newKey)
  if (index === -1) {
    return [
      [...keys, newKey],
      [...components, newComponent],
    ]
  } else {
    const newComponents = [...components]
    newComponents[index] = newComponent
    return [keys, newComponents]
  }
}

function removeRenderer(state: PortalState, renderer: VueRenderer<unknown>): PortalState {
  const [keys, components] = state
  const index = keys.indexOf(renderer.key)
  if (index === -1) return state
  const newKeys = [...keys]
  const newComponents = [...components]
  newKeys.splice(index, 1)
  newComponents.splice(index, 1)
  return [newKeys, newComponents]
}

/**
 * @internal
 */
export interface VueRendererResult {
  readonly render: () => VNode[]
  readonly renderVueRenderer: (renderer: VueRenderer<unknown>) => void
  readonly removeVueRenderer: (renderer: VueRenderer<unknown>) => void
}

/**
 * @internal
 */
export function useVueRenderer(): VueRendererResult {
  const portals = shallowRef<PortalState>([[], []])
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
    portals.value = updateRenderer(portals.value, renderer)

    // Force update the vue component to render
    // Cursor won't move to new node without this
    update.updater?.()
  }

  const removeVueRenderer = (renderer: VueRenderer<unknown>) => {
    portals.value = removeRenderer(portals.value, renderer)
  }

  const render = () => {
    const children: VNode[] = []
    const [keys, components] = portals.value
    const length = keys.length
    for (let i = 0; i < length; i++) {
      const key = keys[i]
      const Component = components[i]
      children.push(h(Component, { key }))
    }
    return children
  }

  return {
    render,
    renderVueRenderer,
    removeVueRenderer,
  } as const
}

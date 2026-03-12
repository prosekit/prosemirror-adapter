import type { DefineComponent, VNode } from 'vue'
import { getCurrentInstance, h, markRaw, onBeforeMount, onUnmounted, ref } from 'vue'

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
  readonly render: () => VNode[]
  readonly renderVueRenderer: (renderer: VueRenderer<unknown>) => void
  readonly removeVueRenderer: (renderer: VueRenderer<unknown>) => void
}

/**
 * @internal
 */
export function useVueRenderer(): VueRendererResult {
  const portals = ref<Record<string, VueRendererComponent>>({})
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
    portals.value[renderer.key] = renderer.render()

    // Force update the vue component to render
    // Cursor won't move to new node without this
    update.updater?.()
  }

  const removeVueRenderer = (renderer: VueRenderer<unknown>) => {
    delete portals.value[renderer.key]
  }

  const render = () => {
    const children: VNode[] = []
    for (const key in portals.value) {
      const Portal = portals.value[key]
      children.push(h(Portal, { key }))
    }
    return children
  }

  return {
    render,
    renderVueRenderer,
    removeVueRenderer,
  } as const
}

import { inject, onMounted, onUnmounted, provide, ref } from 'vue'
import type { InjectionKey, Ref } from 'vue'

import { getNow } from '../../shared/utils'

const ExtraContextKey: InjectionKey<Ref<string>> = Symbol('ExtraContext')

export function provideExtraContext(): void {
  const now = ref('')

  onMounted(() => {
    const id = setInterval(() => {
      now.value = getNow()
    }, 1000)

    onUnmounted(() => {
      clearInterval(id)
    })
  })

  provide(ExtraContextKey, now)
}

export function useExtraContext(): Ref<string> {
  const context = inject(ExtraContextKey)
  if (!context) {
    throw new Error('useExtraContext must be used within a component that calls provideExtraContext')
  }
  return context
}

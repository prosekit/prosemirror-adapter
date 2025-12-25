import { getContext, setContext } from 'svelte'

import { getNow } from '../../shared/utils'

const EXTRA_CONTEXT_KEY = Symbol('ExtraContext')

export function provideExtraContext(): void {
  let now = $state('')

  $effect(() => {
    const id = setInterval(() => {
      now = getNow()
    }, 1000)

    return () => clearInterval(id)
  })

  setContext(EXTRA_CONTEXT_KEY, () => now)
}

export function useExtraContext(): () => string {
  const getNow = getContext<() => string>(EXTRA_CONTEXT_KEY)
  if (!getNow) {
    throw new Error('useExtraContext must be used within a component that calls provideExtraContext')
  }
  return getNow
}

import { createContext, useContext, onMount, onCleanup, createSignal } from 'solid-js'
import type { Accessor, ParentComponent } from 'solid-js'

import { getNow } from '../../shared/utils'

const ExtraContext = createContext<Accessor<string>>()

export const ExtraContextProvider: ParentComponent = (props) => {
  const [now, setNow] = createSignal('')

  onMount(() => {
    const id = setInterval(() => {
      setNow(getNow())
    }, 1000)

    onCleanup(() => {
      clearInterval(id)
    })
  })

  return <ExtraContext.Provider value={now}>{props.children}</ExtraContext.Provider>
}

export function useExtraContext(): Accessor<string> {
  const context = useContext(ExtraContext)
  if (!context) {
    throw new Error('useExtraContext must be used within ExtraContextProvider')
  }
  return context
}

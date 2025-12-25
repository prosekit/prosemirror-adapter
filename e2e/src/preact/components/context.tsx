import { createContext } from 'preact'
import type { ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

import { getNow } from '../../shared/utils'

const ExtraContext = createContext<string>('')

export function ExtraContextProvider({ children }: { children: ComponentChildren }) {
  const [now, setNow] = useState('')

  useEffect(() => {
    const id = setInterval(() => setNow(getNow()), 1000)
    return () => clearInterval(id)
  }, [])

  return <ExtraContext.Provider value={now}>{children}</ExtraContext.Provider>
}

export function useExtraContext(): string {
  return useContext(ExtraContext)
}

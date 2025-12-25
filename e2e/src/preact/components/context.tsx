import { createContext } from 'preact'
import type { ComponentChildren } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

const ExtraContext = createContext<string>('')

function getNow(): string {
  return new Date().toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

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

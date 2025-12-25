import { createContext } from '@lit/context'

export const extraContext = createContext<string>(Symbol('extra-context'))

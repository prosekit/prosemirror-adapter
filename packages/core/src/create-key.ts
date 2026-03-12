import { getId } from '@ocavue/utils'

export function createKey(): string {
  return `${getId()}`
}

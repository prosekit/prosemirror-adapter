import { useWidgetViewContext } from '@prosemirror-adapter/solid'
import { createMemo } from 'solid-js'

export function Hashes() {
  const context = useWidgetViewContext()
  const level = createMemo(() => context().spec?.level as number)
  const hashes = createMemo(() => new Array(level() || 0).fill('#').join(''))

  return <span style={{ color: 'blue', 'margin-right': '6px' }}>{hashes()}</span>
}

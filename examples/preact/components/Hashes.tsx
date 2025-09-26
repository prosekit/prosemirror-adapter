import { useWidgetViewContext } from '@prosemirror-adapter/preact'

export function Hashes() {
  const { spec } = useWidgetViewContext()
  const level = spec?.level as number
  const hashes = new Array(level || 0).fill('#').join('')

  return <span style={{ color: 'blue', marginRight: 6 }}>{hashes}</span>
}

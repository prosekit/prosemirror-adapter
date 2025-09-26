import { usePluginViewContext } from '@prosemirror-adapter/preact'

export function Size() {
  const { view } = usePluginViewContext()
  const size = view.state.doc.nodeSize
  return (
    <div>
      Size for document:
      {size}
    </div>
  )
}

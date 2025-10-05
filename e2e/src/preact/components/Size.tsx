import { usePluginViewContext } from '@prosemirror-adapter/preact'

export function Size() {
  const { view } = usePluginViewContext()
  const size = view.state.doc.nodeSize
  return <div data-test-id="size-view-plugin">Size for document: {size}</div>
}

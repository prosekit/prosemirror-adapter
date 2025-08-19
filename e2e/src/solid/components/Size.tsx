import { usePluginViewContext } from '@prosemirror-adapter/solid'
import { createMemo } from 'solid-js'

export function Size() {
  const context = usePluginViewContext()
  const size = createMemo(() => context().view.state.doc.nodeSize)

  return <div data-test-id="size-view-plugin">Size for document: {size()}</div>
}

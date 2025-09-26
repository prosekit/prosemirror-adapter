import { useNodeViewContext } from '@prosemirror-adapter/solid'
import { createMemo } from 'solid-js'
import { Dynamic } from 'solid-js/web'

export function Heading() {
  const context = useNodeViewContext()
  const Tag = createMemo(() => `h${context().node.attrs.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6')

  return <Dynamic component={Tag()} ref={context().contentRef} />
}

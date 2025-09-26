import { useNodeViewContext } from '@prosemirror-adapter/preact'

export function Paragraph() {
  const { contentRef, selected } = useNodeViewContext()
  return <div role="presentation" ref={contentRef} style={{ outline: selected ? 'blue solid 1px' : 'none' }} />
}

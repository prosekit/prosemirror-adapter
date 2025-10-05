import { useNodeViewContext } from '@prosemirror-adapter/preact'

export function Paragraph() {
  const { contentRef, selected } = useNodeViewContext()
  return <div style={{ outline: selected ? 'blue solid 1px' : 'none' }} role="presentation" ref={contentRef} />
}

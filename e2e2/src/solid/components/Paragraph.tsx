import { useNodeViewContext } from '@prosemirror-adapter/solid'

export function Paragraph() {
  const context = useNodeViewContext()

  return (
    <div
      style={{ outline: context().selected ? 'blue solid 1px' : 'none' }}
      role="presentation"
      ref={context().contentRef}
    />
  )
}

import { useNodeViewContext } from '@prosemirror-adapter/solid'

export function CodeBlock() {
  const context = useNodeViewContext()
  return <pre ref={context().contentRef} />
}

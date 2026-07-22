import { useNodeViewContext } from '@prosemirror-adapter/preact'

export function CodeBlock() {
  const { contentRef } = useNodeViewContext()
  return <pre ref={contentRef} />
}

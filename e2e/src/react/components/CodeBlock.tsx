import { useNodeViewContext } from '@prosemirror-adapter/react'

export function CodeBlock() {
  const { contentRef } = useNodeViewContext()
  return <pre ref={contentRef} />
}

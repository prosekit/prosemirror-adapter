import { NodeViewContent, NodeViewRoot, useNodeViewContext } from '@prosemirror-adapter/react'

export function Paragraph() {
  const { contentRef, selected } = useNodeViewContext()
  const shouldMixContentRef =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('mixed-content-ref')

  return (
    <NodeViewRoot
      aria-hidden={true}
      data-react-node-view-root="true"
      role="presentation"
      style={{ outline: selected ? 'blue solid 1px' : 'none', width: 10 }}
    >
      <NodeViewContent className="react-node-view-content" data-react-node-view-content="true" />
      {shouldMixContentRef ? <span ref={contentRef} /> : null}
    </NodeViewRoot>
  )
}

import { useMarkViewContext } from '@prosemirror-adapter/react'
import { useState } from 'react'

export function Link() {
  const { contentRef, mark } = useMarkViewContext()
  const [count, setCount] = useState(0)

  const href = mark.attrs.href as string

  return (
    <span onPointerEnter={() => setCount(count => count + 1)}>
      <a href={href} ref={contentRef}></a>
      <span style={{ opacity: 0.5 }}>{` (hover count: ${count})`}</span>
    </span>
  )
}

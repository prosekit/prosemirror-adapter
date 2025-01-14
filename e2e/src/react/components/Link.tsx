import { useMarkViewContext } from '@prosemirror-adapter/react'
import { useEffect, useState } from 'react'

const colors = [
  '#f06292',
  '#ba68c8',
  '#9575cd',
  '#7986cb',
  '#64b5f6',
  '#4fc3f7',
  '#4dd0e1',
  '#4db6ac',
  '#81c784',
  '#aed581',
  '#ffb74d',
  '#ffa726',
  '#ff8a65',
  '#d4e157',
  '#ffd54f',
  '#ffecb3',
]

function pickRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}

export function Link() {
  const [color, setColor] = useState(colors[0])
  const { mark, contentRef } = useMarkViewContext()
  const href = mark.attrs.href as string
  const title = mark.attrs.title as string | null

  useEffect(() => {
    const interval = setInterval(() => {
      setColor(pickRandomColor())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <a
      href={href}
      ref={contentRef}
      style={{ color, transition: 'color 1s ease-in-out' }}
      title={title || undefined}
    >
    </a>
  )
}

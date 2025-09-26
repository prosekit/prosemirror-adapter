import { useMarkViewContext } from '@prosemirror-adapter/solid'
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js'

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
  const [color, setColor] = createSignal(colors[0])
  const context = useMarkViewContext()
  const href = createMemo(() => context().mark.attrs.href as string)
  const title = createMemo(() => context().mark.attrs.title as string | null)
  createEffect(() => {
    const interval = setInterval(() => {
      setColor(pickRandomColor())
    }, 1000)
    return onCleanup(() => clearInterval(interval))
  })

  return (
    <a
      href={href()}
      title={title() || undefined}
      ref={context().contentRef}
      style={{ color: color(), transition: 'color 1s ease-in-out' }}
    ></a>
  )
}

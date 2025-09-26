import { useNodeViewContext } from '@prosemirror-adapter/preact'
import type { FunctionComponent } from 'preact'
import { useMemo } from 'preact/hooks'

export const Heading: FunctionComponent = () => {
  const { contentRef, node, setAttrs } = useNodeViewContext()
  const level = node.attrs.level as number

  const Tag = useMemo(() => `h${level}` as 'h1', [level])

  const onChange = (e: Event) => {
    const target = e.target as HTMLSelectElement
    setAttrs({ level: Number(target.value) })
  }

  return (
    <Tag>
      <select contentEditable={false} value={level} onChange={onChange}>
        <option value={1}>H1</option>
        <option value={2}>H2</option>
        <option value={3}>H3</option>
        <option value={4}>H4</option>
        <option value={5}>H5</option>
        <option value={6}>H6</option>
      </select>
      <span ref={contentRef}></span>
    </Tag>
  )
}

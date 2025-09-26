import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/preact'
import { useState } from 'preact/hooks'

import { Editor } from './components/Editor'

export function App() {
  const [counter, setCounter] = useState<number>(0)
  return (
    <>
      <h1>Prosemirror Adapter Preact</h1>
      <button onClick={() => setCounter((c: number) => c + 1)}>rerender</button>
      <ProsemirrorAdapterProvider key={counter}>
        <Editor />
      </ProsemirrorAdapterProvider>
    </>
  )
}

import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/preact'
import { useState } from 'preact/hooks'

import { Editor } from './components/Editor'

export function App() {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <h1>Prosemirror Adapter Preact</h1>
      <button onClick={() => setCounter((value) => value + 1)}>rerender</button>
      <ProsemirrorAdapterProvider key={counter}>
        <Editor />
      </ProsemirrorAdapterProvider>
    </div>
  )
}

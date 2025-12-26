import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/preact'
import { StrictMode } from 'preact/compat'
import { useState } from 'preact/hooks'

import { Editor } from './components/Editor'
import { ExtraContextProvider } from './components/context'

export function App() {
  const [counter, setCounter] = useState(0)
  return (
    <StrictMode>
      <h1>Prosemirror Adapter Preact</h1>
      <button onClick={() => setCounter((c) => c + 1)}>rerender</button>
      <ExtraContextProvider>
        <ProsemirrorAdapterProvider key={counter}>
          <Editor />
        </ProsemirrorAdapterProvider>
      </ExtraContextProvider>
    </StrictMode>
  )
}

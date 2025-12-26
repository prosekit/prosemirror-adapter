import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/react'
import { StrictMode, useState } from 'react'

import { Editor } from './components/Editor'
import { ExtraContextProvider } from './components/context'

export function App() {
  const [counter, setCounter] = useState(0)
  return (
    <StrictMode>
      <h1>Prosemirror Adapter React</h1>
      <button onClick={() => setCounter((c) => c + 1)}>rerender</button>
      <ExtraContextProvider>
        <ProsemirrorAdapterProvider key={counter}>
          <Editor />
        </ProsemirrorAdapterProvider>
      </ExtraContextProvider>
    </StrictMode>
  )
}

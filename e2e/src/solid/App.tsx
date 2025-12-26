/* @refresh reload */

import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/solid'

import { Editor } from './components/Editor'
import { ExtraContextProvider } from './components/context'
import './index.css'

export function App() {
  return (
    <>
      <h1>Prosemirror Adapter Solid</h1>

      <ExtraContextProvider>
        <ProsemirrorAdapterProvider>
          <Editor />
        </ProsemirrorAdapterProvider>
      </ExtraContextProvider>
    </>
  )
}

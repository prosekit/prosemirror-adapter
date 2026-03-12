/* @refresh reload */

import './index.css'

import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/solid'

import { ExtraContextProvider } from './components/context'
import { Editor } from './components/Editor'

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

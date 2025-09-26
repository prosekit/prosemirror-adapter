/* @refresh reload */

import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/solid'

import { Editor } from './components/Editor'
import './index.css'

export function App() {
  return (
    <>
      <h1>Prosemirror Adapter Solid</h1>

      <ProsemirrorAdapterProvider>
        <Editor />
      </ProsemirrorAdapterProvider>
    </>
  )
}

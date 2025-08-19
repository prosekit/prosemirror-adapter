/* @refresh reload */

import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/solid'
import { render } from 'solid-js/web'

import { Editor } from './components/Editor'
import './index.css'

const root = document.getElementById('root')

if ((import.meta.env as { DEV: boolean }).DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  )
}

render(
  () => (
    <>
      <h1>Prosemirror Adapter React</h1>

      <ProsemirrorAdapterProvider>
        <Editor />
      </ProsemirrorAdapterProvider>
    </>
  ),
  root!,
)

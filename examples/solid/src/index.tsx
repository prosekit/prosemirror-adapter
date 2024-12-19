import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/solid'

/* @refresh reload */
import { render } from 'solid-js/web'
import { Editor } from './components/Editor'
import './index.css'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
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

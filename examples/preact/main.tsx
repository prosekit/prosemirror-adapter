import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/preact'
import { render } from 'preact'
import { StrictMode } from 'preact/compat'

import { Editor } from './components/Editor'

const root$ = document.getElementById('app')
if (!root$) throw new Error('No root element found')

render(
  <StrictMode>
    <h1>Prosemirror Adapter Preact</h1>
    <ProsemirrorAdapterProvider>
      <Editor />
    </ProsemirrorAdapterProvider>
  </StrictMode>,
  root$,
)

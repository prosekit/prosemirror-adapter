import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/preact'
import { render } from 'preact'

import { Editor } from './components/Editor'

const root$ = document.getElementById('app')
if (!root$) throw new Error('No root element found')

render(
  <div>
    <h1>Prosemirror Adapter Preact</h1>
    <ProsemirrorAdapterProvider>
      <Editor />
    </ProsemirrorAdapterProvider>
  </div>,
  root$,
)

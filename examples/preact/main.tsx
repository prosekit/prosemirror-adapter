import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/preact'
import { render } from 'preact'

import { Editor } from './components/Editor'

const app = document.getElementById('app')
if (!app) throw new Error('No app element found')

render(
  <>
    <h1>Prosemirror Adapter Preact</h1>
    <ProsemirrorAdapterProvider>
      <Editor />
    </ProsemirrorAdapterProvider>
  </>,
  app,
)

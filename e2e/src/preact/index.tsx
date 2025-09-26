import { render } from 'preact'

import { App } from './App'

const root$ = document.getElementById('app')
if (!root$) throw new Error('No root element found')

render(<App />, root$)

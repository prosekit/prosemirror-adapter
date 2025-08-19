import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'

import type { SvelteComponentConstructor } from '../types'

export type SvelteMarkViewComponent = SvelteComponentConstructor 

export type SvelteMarkViewSpec = CoreMarkViewSpec<SvelteMarkViewComponent>

export type SvelteMarkViewUserOptions = CoreMarkViewUserOptions<SvelteMarkViewComponent>

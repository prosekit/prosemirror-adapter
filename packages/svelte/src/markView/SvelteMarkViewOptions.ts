import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'

import type { SvelteComponentConstructor } from '../types'

interface EmptyProps {}
export type SvelteMarkViewComponent = SvelteComponentConstructor<EmptyProps>

export type SvelteMarkViewSpec = CoreMarkViewSpec<SvelteMarkViewComponent>

export type SvelteMarkViewUserOptions = CoreMarkViewUserOptions<SvelteMarkViewComponent>

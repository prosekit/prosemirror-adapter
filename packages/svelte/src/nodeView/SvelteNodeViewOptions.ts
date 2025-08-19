import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'

import type { SvelteComponentConstructor } from '../types'

export type SvelteNodeViewComponent = SvelteComponentConstructor 

export type SvelteNodeViewSpec = CoreNodeViewSpec<SvelteNodeViewComponent>

export type SvelteNodeViewUserOptions = CoreNodeViewUserOptions<SvelteNodeViewComponent>

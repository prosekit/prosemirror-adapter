import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'

import type { SvelteComponentConstructor } from '../types'

interface EmptyProps {}
export type SvelteNodeViewComponent = SvelteComponentConstructor<EmptyProps>

export type SvelteNodeViewSpec = CoreNodeViewSpec<SvelteNodeViewComponent>

export type SvelteNodeViewUserOptions = CoreNodeViewUserOptions<SvelteNodeViewComponent>

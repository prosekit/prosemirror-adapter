import type { CorePluginViewSpec, CorePluginViewUserOptions } from '@prosemirror-adapter/core'

import type { SvelteComponentConstructor } from '../types'

export type SveltePluginViewComponent = SvelteComponentConstructor 

export type SveltePluginViewSpec = CorePluginViewSpec<SveltePluginViewComponent>

export type SveltePluginViewUserOptions = CorePluginViewUserOptions<SveltePluginViewComponent>

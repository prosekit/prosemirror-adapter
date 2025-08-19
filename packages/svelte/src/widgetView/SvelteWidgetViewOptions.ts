import type { CoreWidgetViewSpec, CoreWidgetViewUserOptions } from '@prosemirror-adapter/core'

import type { SvelteComponentConstructor } from '../types'

export type SvelteWidgetViewComponent = SvelteComponentConstructor

export type SvelteWidgetViewSpec = CoreWidgetViewSpec<SvelteWidgetViewComponent>

export type SvelteWidgetViewUserOptions = CoreWidgetViewUserOptions<SvelteWidgetViewComponent>

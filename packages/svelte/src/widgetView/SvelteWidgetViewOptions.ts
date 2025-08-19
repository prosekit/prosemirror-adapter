import type { CoreWidgetViewSpec, CoreWidgetViewUserOptions } from '@prosemirror-adapter/core'

import type { SvelteComponentConstructor } from '../types'

interface EmptyProps {}
export type SvelteWidgetViewComponent = SvelteComponentConstructor<EmptyProps>

export type SvelteWidgetViewSpec = CoreWidgetViewSpec<SvelteWidgetViewComponent>

export type SvelteWidgetViewUserOptions = CoreWidgetViewUserOptions<SvelteWidgetViewComponent>

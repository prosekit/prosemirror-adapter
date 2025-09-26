import type { CoreWidgetViewSpec, CoreWidgetViewUserOptions } from '@prosemirror-adapter/core'
import type { FunctionComponent } from 'preact'

export type PreactWidgetViewComponent = FunctionComponent<Record<string, never>>

export type PreactWidgetViewSpec = CoreWidgetViewSpec<PreactWidgetViewComponent>

export type PreactWidgetViewUserOptions = CoreWidgetViewUserOptions<PreactWidgetViewComponent>

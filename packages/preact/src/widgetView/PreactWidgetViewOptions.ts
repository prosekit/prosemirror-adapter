import type { CoreWidgetViewSpec, CoreWidgetViewUserOptions } from '@prosemirror-adapter/core'
import type { ComponentType } from 'preact'

export type PreactWidgetViewComponent = ComponentType<Record<string, never>>

export type PreactWidgetViewSpec = CoreWidgetViewSpec<PreactWidgetViewComponent>

export type PreactWidgetViewUserOptions = CoreWidgetViewUserOptions<PreactWidgetViewComponent>
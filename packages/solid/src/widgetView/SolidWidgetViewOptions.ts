import type { CoreWidgetViewSpec, CoreWidgetViewUserOptions } from '@prosemirror-adapter/core'
import type { ValidComponent } from 'solid-js'

export type SolidWidgetViewComponent = ValidComponent

export type SolidWidgetViewSpec = CoreWidgetViewSpec<SolidWidgetViewComponent>

export type SolidWidgetViewUserOptions = CoreWidgetViewUserOptions<SolidWidgetViewComponent>

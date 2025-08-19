import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'
import type { ValidComponent } from 'solid-js'

export type SolidMarkViewComponent = ValidComponent

export type SolidMarkViewSpec = CoreMarkViewSpec<SolidMarkViewComponent>

export type SolidMarkViewUserOptions = CoreMarkViewUserOptions<SolidMarkViewComponent>

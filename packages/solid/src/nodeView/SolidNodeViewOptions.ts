import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'
import type { ValidComponent } from 'solid-js'

export type SolidNodeViewComponent = ValidComponent

export type SolidNodeViewSpec = CoreNodeViewSpec<SolidNodeViewComponent>

export type SolidNodeViewUserOptions = CoreNodeViewUserOptions<SolidNodeViewComponent>

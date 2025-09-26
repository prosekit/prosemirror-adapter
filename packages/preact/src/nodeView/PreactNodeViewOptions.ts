import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'
import type { FunctionComponent } from 'preact'

export type PreactNodeViewComponent = FunctionComponent<Record<string, never>>

export type PreactNodeViewSpec = CoreNodeViewSpec<PreactNodeViewComponent>

export type PreactNodeViewUserOptions = CoreNodeViewUserOptions<PreactNodeViewComponent>

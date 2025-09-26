import type { CoreNodeViewSpec, CoreNodeViewUserOptions } from '@prosemirror-adapter/core'
import type { ComponentType } from 'preact'

export type PreactNodeViewComponent = ComponentType<Record<string, never>>

export type PreactNodeViewSpec = CoreNodeViewSpec<PreactNodeViewComponent>

export type PreactNodeViewUserOptions = CoreNodeViewUserOptions<PreactNodeViewComponent>

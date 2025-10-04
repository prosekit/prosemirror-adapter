import type { CorePluginViewSpec, CorePluginViewUserOptions } from '@prosemirror-adapter/core'
import type { ComponentType } from 'preact'

export type PreactPluginViewComponent = ComponentType<Record<string, never>>

export type PreactPluginViewSpec = CorePluginViewSpec<PreactPluginViewComponent>

export type PreactPluginViewUserOptions = CorePluginViewUserOptions<PreactPluginViewComponent>
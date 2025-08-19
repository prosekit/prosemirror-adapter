import type { CorePluginViewSpec, CorePluginViewUserOptions } from '@prosemirror-adapter/core'
import type { ValidComponent } from 'solid-js'

export type SolidPluginViewComponent = ValidComponent

export type SolidPluginViewSpec = CorePluginViewSpec<SolidPluginViewComponent>

export type SolidPluginViewUserOptions = CorePluginViewUserOptions<SolidPluginViewComponent>

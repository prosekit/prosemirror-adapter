import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'
import type { ComponentType } from 'preact'

export type PreactMarkViewComponent = ComponentType<Record<string, never>>

export type PreactMarkViewSpec = CoreMarkViewSpec<PreactMarkViewComponent>

export type PreactMarkViewUserOptions = CoreMarkViewUserOptions<PreactMarkViewComponent>

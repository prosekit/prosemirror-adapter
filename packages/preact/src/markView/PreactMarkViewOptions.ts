import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'
import type { FunctionComponent } from 'preact'

export type PreactMarkViewComponent = FunctionComponent<Record<string, never>>

export type PreactMarkViewSpec = CoreMarkViewSpec<PreactMarkViewComponent>

export type PreactMarkViewUserOptions = CoreMarkViewUserOptions<PreactMarkViewComponent>

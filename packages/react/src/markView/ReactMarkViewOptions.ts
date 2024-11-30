import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'
import type { ComponentType } from 'react'

export type ReactMarkViewComponent = ComponentType<Record<string, never>>

export type ReactMarkViewSpec = CoreMarkViewSpec<ReactMarkViewComponent>

export type ReactMarkViewUserOptions = CoreMarkViewUserOptions<ReactMarkViewComponent>

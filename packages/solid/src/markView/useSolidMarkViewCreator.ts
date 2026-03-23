import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'
import type { MarkViewConstructor } from 'prosemirror-view'

import type { SolidRendererResult } from '../SolidRenderer'

import type { AbstractSolidMarkView } from './SolidMarkView'
import { SolidMarkView } from './SolidMarkView'

/**
 * @internal
 */
export function buildSolidMarkViewCreator<ComponentType>(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
  SolidMarkViewClass: new (spec: CoreMarkViewSpec<ComponentType>) => AbstractSolidMarkView<ComponentType>,
) {
  return function markViewCreator(userOptions: CoreMarkViewUserOptions<ComponentType>): MarkViewConstructor {
    return function markViewConstructor(mark, view, inline) {
      const patchedUserOptions: CoreMarkViewUserOptions<ComponentType> = {
        ...userOptions,
        destroy() {
          userOptions.destroy?.()
          removeSolidRenderer(markView)
        },
      }
      const spec: CoreMarkViewSpec<ComponentType> = {
        mark,
        view,
        inline,
        options: patchedUserOptions,
      }
      const markView = new SolidMarkViewClass(spec)
      renderSolidRenderer(markView, false)
      return markView
    }
  }
}

export function useSolidMarkViewCreator(
  renderSolidRenderer: SolidRendererResult['renderSolidRenderer'],
  removeSolidRenderer: SolidRendererResult['removeSolidRenderer'],
) {
  return buildSolidMarkViewCreator(renderSolidRenderer, removeSolidRenderer, SolidMarkView)
}

import type { CoreMarkViewSpec, CoreMarkViewUserOptions } from '@prosemirror-adapter/core'
import type { MarkViewConstructor } from 'prosemirror-view'

import type { VueRendererResult } from '../VueRenderer'

import type { AbstractVueMarkView } from './VueMarkView'
import { VueMarkView } from './VueMarkView'

/**
 * @internal
 */
export function buildVueMarkViewCreator<ComponentType>(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
  VueMarkViewClass: new (spec: CoreMarkViewSpec<ComponentType>) => AbstractVueMarkView<ComponentType>,
) {
  return function markViewCreator(userOptions: CoreMarkViewUserOptions<ComponentType>): MarkViewConstructor {
    return function markViewConstructor(mark, view, inline) {
      const patchedUserOptions: CoreMarkViewUserOptions<ComponentType> = {
        ...userOptions,
        destroy() {
          userOptions.destroy?.()
          removeVueRenderer(markView)
        },
      }
      const spec: CoreMarkViewSpec<ComponentType> = {
        mark,
        view,
        inline,
        options: patchedUserOptions,
      }
      const markView = new VueMarkViewClass(spec)
      renderVueRenderer(markView)
      return markView
    }
  }
}

export function useVueMarkViewCreator(
  renderVueRenderer: VueRendererResult['renderVueRenderer'],
  removeVueRenderer: VueRendererResult['removeVueRenderer'],
) {
  return buildVueMarkViewCreator(renderVueRenderer, removeVueRenderer, VueMarkView)
}

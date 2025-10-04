import { useNodeViewFactory, usePluginViewFactory, useWidgetViewFactory } from '@prosemirror-adapter/preact'
import { useCallback, useRef } from 'preact/hooks'
import { Plugin } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import { DecorationSet } from 'prosemirror-view'

import { createEditorView } from '../createEditorView'

import { Hashes } from './Hashes'
import { Heading } from './Heading'
import { Paragraph } from './Paragraph'
import { Size } from './Size'
import './Editor.css'

export function Editor() {
  const viewRef = useRef<EditorView | null>(null)
  const nodeViewFactory = useNodeViewFactory()
  const pluginViewFactory = usePluginViewFactory()
  const widgetViewFactory = useWidgetViewFactory()

  const editorRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (!element) return

      if (element.firstChild) return

      const getHashWidget = widgetViewFactory({
        as: 'i',
        component: Hashes,
      })

      viewRef.current = createEditorView(
        element,
        {
          paragraph: nodeViewFactory({
            component: Paragraph,
            as: 'div',
            contentAs: 'p',
          }),
          heading: nodeViewFactory({
            component: Heading,
          }),
        },
        [
          new Plugin({
            view: pluginViewFactory({
              component: Size,
            }),
          }),
          new Plugin({
            props: {
              decorations(state) {
                const { $from } = state.selection
                const node = $from.node()
                if (node.type.name !== 'heading') return DecorationSet.empty

                const widget = getHashWidget($from.before() + 1, {
                  side: -1,
                  level: node.attrs.level as number,
                })

                return DecorationSet.create(state.doc, [widget])
              },
            },
          }),
        ],
      )
    },
    [nodeViewFactory, pluginViewFactory, widgetViewFactory],
  )

  return <div className="editor" ref={editorRef} />
}

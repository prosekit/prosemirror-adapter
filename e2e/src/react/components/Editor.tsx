import {
  useMarkViewFactory,
  useNodeViewFactory,
  usePluginViewFactory,
  useWidgetViewFactory,
} from '@prosemirror-adapter/react'
import { Plugin } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import { DecorationSet } from 'prosemirror-view'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'

import { createEditorView } from '../../createEditorView'

import { Hashes } from './Hashes'
import { Heading } from './Heading'
import { Link } from './Link'
import { Paragraph } from './Paragraph'
import { Size } from './Size'
import './Editor.css'

export const Editor: FC = () => {
  const viewRef = useRef<EditorView>()
  const nodeViewFactory = useNodeViewFactory()
  const markViewFactory = useMarkViewFactory()
  const pluginViewFactory = usePluginViewFactory()
  const widgetViewFactory = useWidgetViewFactory()
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = editorRef.current
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
      {
        link: markViewFactory({
          component: Link,
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
    return () => {
      viewRef.current?.destroy()
    }
  }, [nodeViewFactory, markViewFactory, pluginViewFactory, widgetViewFactory])

  return <div className="editor" ref={editorRef} />
}

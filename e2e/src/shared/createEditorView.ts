import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-example-setup/style/style.css'
import 'prosemirror-menu/style/menu.css'

import { exampleSetup } from 'prosemirror-example-setup'
import { keymap } from 'prosemirror-keymap'
import { schema } from 'prosemirror-schema-basic'
import { EditorState, Plugin } from 'prosemirror-state'
import type { MarkViewConstructor, NodeViewConstructor } from 'prosemirror-view'
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'

const defaultDoc = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Hello ProseMirror',
        },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is editable text. You can focus it and start typing.',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'To apply styling, you can select a piece of text and manipulate its styling from the menu. The basic schema supports ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'em',
            },
          ],
          text: 'emphasis',
        },
        {
          type: 'text',
          text: ', ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'strong',
            },
          ],
          text: 'strong text',
        },
        {
          type: 'text',
          text: ', ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'http://marijnhaverbeke.nl/blog',
                title: null,
              },
            },
          ],
          text: 'links',
        },
        {
          type: 'text',
          text: ', ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'code',
            },
          ],
          text: 'code font',
        },
        {
          type: 'text',
          text: ', and ',
        },
        {
          type: 'image',
          attrs: {
            src: 'https://prosemirror.net/img/smiley.png',
            alt: null,
            title: null,
          },
        },
        {
          type: 'text',
          text: ' images.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Block-level structure can be manipulated with key bindings (try ctrl-shift-2 to create a level 2 heading, or enter in an empty textblock to exit the parent block), or through the menu.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Try using the “list” item in the menu to wrap this paragraph in a numbered list.',
        },
      ],
    },
    {
      type: 'code_block',
      content: [
        {
          type: 'text',
          text: 'const greeting = "hello"',
        },
      ],
    },
  ],
}

// Mimics an inline syntax highlighter: wraps every word inside a code block
// in a styled span, like prosemirror-highlight and similar plugins do.
function createCodeHighlightPlugin(): Plugin {
  return new Plugin({
    props: {
      decorations(state) {
        const decorations: Decoration[] = []
        state.doc.descendants((node, pos) => {
          if (node.type.name !== 'code_block') return true
          const pattern = /\S+/g
          for (const match of node.textContent.matchAll(pattern)) {
            const from = pos + 1 + match.index
            decorations.push(Decoration.inline(from, from + match[0].length, { style: 'color: rgb(207, 34, 46)' }))
          }
          return false
        })
        return DecorationSet.create(state.doc, decorations)
      },
    },
  })
}

export function createEditorView(
  element: HTMLElement | ShadowRoot,
  nodeViews: Record<string, NodeViewConstructor>,
  markViews: Record<string, MarkViewConstructor>,
  plugins: Plugin[],
) {
  return new EditorView(element, {
    state: EditorState.create({
      doc: schema.nodeFromJSON(defaultDoc),
      schema,
      plugins: [
        ...exampleSetup({ schema }),
        keymap({
          'Mod-[': (state, dispatch) => {
            const { selection } = state
            const node = selection.$from.node()
            if (node.type.name !== 'heading') return false

            let level = node.attrs.level as number
            if (level >= 6) level = 1
            else level += 1

            dispatch?.(
              state.tr.setNodeMarkup(selection.$from.before(), null, {
                ...node.attrs,
                level,
              }),
            )
            return true
          },
        }),
        createCodeHighlightPlugin(),
        ...plugins,
      ],
    }),
    nodeViews,
    markViews,
  })
}

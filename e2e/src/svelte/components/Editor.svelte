<script lang="ts">
  import {
    useNodeViewFactory,
    usePluginViewFactory,
    useWidgetViewFactory,
    useMarkViewFactory,
  } from '@prosemirror-adapter/svelte'
  import { Plugin } from 'prosemirror-state'
  import { DecorationSet, EditorView } from 'prosemirror-view'
  import { onDestroy } from 'svelte'
  import { createEditorView } from '../../shared/createEditorView'
  import Hashes from './Hashes.svelte'
  import Paragraph from './Paragraph.svelte'
  import Heading from './Heading.svelte'
  import Size from './Size.svelte'
  import Link from './Link.svelte'

  const nodeViewFactory = useNodeViewFactory()
  const markViewFactory = useMarkViewFactory()
  const pluginViewFactory = usePluginViewFactory()
  const widgetViewFactory = useWidgetViewFactory()

  const getHashWidget = widgetViewFactory({
    component: Hashes,
    as: 'i',
  })

  let editorView: EditorView

  function editor(element: HTMLElement) {
    editorView = createEditorView(
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
          as: 'span',
          contentAs: 'span',
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
                level: node.attrs.level,
                ignoreSelection: true
              })

              return DecorationSet.create(state.doc, [widget])
            },
          },
        }),
      ],
    )
  }

  onDestroy(() => {
    editorView.destroy()
  })
</script>

<div class="editor" use:editor></div>

<style>
  .editor {
    background: white;
    color: black;
    background-clip: padding-box;
    border-radius: 4px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    padding: 5px 0;
    margin-bottom: 23px;
    position: relative;
  }

  :global(.ProseMirror p:first-child),
  :global(.ProseMirror h1:first-child),
  :global(.ProseMirror h2:first-child),
  :global(.ProseMirror h3:first-child),
  :global(.ProseMirror h4:first-child),
  :global(.ProseMirror h5:first-child),
  :global(.ProseMirror h6:first-child) {
    margin-top: 10px;
  }

  :global(.ProseMirror) {
    padding: 4px 8px 4px 14px;
    line-height: 1.2;
    outline: none;
  }

  :global(.ProseMirror p) {
    margin-bottom: 1em;
  }
</style>

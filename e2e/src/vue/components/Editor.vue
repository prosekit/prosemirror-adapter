<script setup lang="ts">
import {
  useMarkViewFactory,
  useNodeViewFactory,
  usePluginViewFactory,
  useWidgetViewFactory,
} from '@prosemirror-adapter/vue'
import { ref, watchEffect } from 'vue'
import { Plugin } from 'prosemirror-state'
import { DecorationSet } from 'prosemirror-view'
import { createEditorView } from '../../shared/createEditorView'
import Paragraph from './Paragraph.vue'
import Heading from './Heading.vue'
import Size from './Size.vue'
import Hashes from './Hashes.vue'
import Link from './Link.vue'

const nodeViewFactory = useNodeViewFactory()
const markViewFactory = useMarkViewFactory()
const pluginViewFactory = usePluginViewFactory()
const widgetViewFactory = useWidgetViewFactory()

const getHashWidget = widgetViewFactory({
  as: 'i',
  component: Hashes,
})

const editorRef = ref<HTMLDivElement | null>(null)

watchEffect((onCleanup) => {
  const el = editorRef.value
  if (!el) {
    return
  }

  const view = createEditorView(
    el,
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
              level: node.attrs.level,
            })

            return DecorationSet.create(state.doc, [widget])
          },
        },
      }),
    ],
  )

  onCleanup(() => {
    view.destroy()
  })
})
</script>

<template>
  <div ref="editorRef" class="editor" />
</template>

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

.ProseMirror p:first-child,
.ProseMirror h1:first-child,
.ProseMirror h2:first-child,
.ProseMirror h3:first-child,
.ProseMirror h4:first-child,
.ProseMirror h5:first-child,
.ProseMirror h6:first-child {
  margin-top: 10px;
}

.ProseMirror {
  padding: 4px 8px 4px 14px;
  line-height: 1.2;
  outline: none;
}

.ProseMirror p {
  margin-bottom: 1em;
}
</style>

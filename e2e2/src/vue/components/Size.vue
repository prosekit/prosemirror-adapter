<script setup lang="ts">
import { usePluginViewContext } from '@prosemirror-adapter/vue'
import { computed } from 'vue'

const { view } = usePluginViewContext()
const size = computed(() => {
  return view.value.state.doc.nodeSize
})
</script>

<template>
  <div data-test-id="size-view-plugin">Size for document: {{ size }}</div>
</template>

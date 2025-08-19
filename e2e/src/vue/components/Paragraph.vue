<script setup lang="ts">
import { useNodeViewContext } from '@prosemirror-adapter/vue'

const { contentRef, selected } = useNodeViewContext()
</script>

<template>
  <div :ref="contentRef" role="presentation" :class="{ selected }" />
</template>

<style scoped>
.selected {
  outline: blue solid 1px;
}
</style>

<script setup lang="ts">
import { useWidgetViewContext } from '@prosemirror-adapter/vue'

const { spec } = useWidgetViewContext()
const level = spec?.level
const hashes = Array(level || 0)
  .fill('#')
  .join('')
</script>

<template>
  <span class="hash">{{ hashes }}</span>
</template>

<style scoped>
.hash {
  color: blue;
  margin-right: 6px;
}
</style>

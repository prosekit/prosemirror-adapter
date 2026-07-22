<script setup lang="ts">
import { useNodeViewContext } from '@prosemirror-adapter/vue'

const { contentRef } = useNodeViewContext()
</script>

<template>
  <pre :ref="contentRef" />
</template>

<script setup lang="ts">
import { useExtraContext } from './context'

const now = useExtraContext()
</script>

<template>
  <div data-test-id="now-view-plugin">Now: {{ now }}</div>
</template>

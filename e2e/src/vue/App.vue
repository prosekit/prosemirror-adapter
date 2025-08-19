<script setup lang="ts">
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue'
import { ref } from 'vue'
import Editor from './components/Editor.vue'

const counter = ref(0)
</script>

<template>
  <h1>Prosemirror Adapter Vue</h1>
  <button @click="counter++">rerender</button>
  <ProsemirrorAdapterProvider :key="counter">
    <Editor />
  </ProsemirrorAdapterProvider>
</template>

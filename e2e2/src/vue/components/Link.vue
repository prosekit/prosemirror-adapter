<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useMarkViewContext } from '@prosemirror-adapter/vue'

const colors = [
  '#f06292',
  '#ba68c8',
  '#9575cd',
  '#7986cb',
  '#64b5f6',
  '#4fc3f7',
  '#4dd0e1',
  '#4db6ac',
  '#81c784',
  '#aed581',
  '#ffb74d',
  '#ffa726',
  '#ff8a65',
  '#d4e157',
  '#ffd54f',
  '#ffecb3',
]

function pickRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}

const color = ref(colors[0])
const { mark, contentRef } = useMarkViewContext()
const href = computed(() => mark.value.attrs.href as string)
const title = computed(() => mark.value.attrs.title as string | null)

let interval: number

onMounted(() => {
  interval = setInterval(() => {
    color.value = pickRandomColor()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <a
    :href="href"
    :ref="contentRef"
    :style="{ color: color, transition: 'color 1s ease-in-out' }"
    :title="title || undefined"
  />
</template>

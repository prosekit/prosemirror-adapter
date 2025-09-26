<script lang="ts">
  import { useNodeViewContext } from '@prosemirror-adapter/svelte'
  let selected = false

  const contentRef = useNodeViewContext('contentRef')
  const selectedStore = useNodeViewContext('selected')
  selectedStore.subscribe((value) => {
    selected = value
  })
</script>

<div use:contentRef class:selected></div>

<style>
  .selected {
    outline: blue solid 1px;
  }
</style>

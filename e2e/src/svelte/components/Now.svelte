<script lang="ts">
  import { useExtraContext } from './context.svelte.ts'
  let now = $state('')
  const getNow = useExtraContext()

  $effect(() => {
    now = getNow()
  })
</script>

<div data-test-id="now-view-plugin">Now: {now}</div>

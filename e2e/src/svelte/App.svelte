<script lang="ts">
  import { useProsemirrorAdapterProvider } from '@prosemirror-adapter/svelte'
  import { onMount } from 'svelte'
  import Editor from './components/Editor.svelte'
  import { provideExtraContext } from './components/context.svelte.ts'

  useProsemirrorAdapterProvider()
  provideExtraContext()

  let count = $state(0)
  function handleClick() {
    count += 1
  }
</script>

<h1>Prosemirror Adapter Svelte</h1>
<button onclick={handleClick}>rerender</button>
{#key count}
  <Editor />
{/key}

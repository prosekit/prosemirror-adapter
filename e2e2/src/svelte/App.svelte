<script lang="ts">
  import { useProsemirrorAdapterProvider } from '@prosemirror-adapter/svelte'
  import Editor from './components/Editor.svelte'

  useProsemirrorAdapterProvider()

  let count = 0
  function handleClick() {
    count += 1
  }
</script>

<h1>Prosemirror Adapter Svelte</h1>
<button on:click={handleClick}>rerender</button>
{#key count}
  <Editor />
{/key}

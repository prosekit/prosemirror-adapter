<script lang="ts">
  import { useProsemirrorAdapterProvider } from '@prosemirror-adapter/svelte'
  import Editor from '../components/Editor.svelte'

  useProsemirrorAdapterProvider()
</script>

<h1>Prosemirror Adapter Svelte</h1>
<Editor />

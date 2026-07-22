<script lang="ts">
  import { useNodeViewContext } from '@prosemirror-adapter/svelte'

  const contentRef = useNodeViewContext('contentRef')
</script>

<pre use:contentRef></pre>

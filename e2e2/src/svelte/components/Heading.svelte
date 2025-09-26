<script lang="ts">
  import { useNodeViewContext } from '@prosemirror-adapter/svelte'
  let tag: string = 'h1'

  const contentRef = useNodeViewContext('contentRef')
  const nodeStore = useNodeViewContext('node')
  nodeStore.subscribe((node) => {
    const level = node.attrs.level
    tag = `h${level}`
  })
</script>

<svelte:element this={tag} use:contentRef />

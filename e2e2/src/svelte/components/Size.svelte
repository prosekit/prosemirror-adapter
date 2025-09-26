<script lang="ts">
  import { usePluginViewContext } from '@prosemirror-adapter/svelte'
  const viewStore = usePluginViewContext('view')
  let size = 0

  viewStore.subscribe((view) => {
    size = view.state.doc.nodeSize
  })
</script>

<div data-test-id="size-view-plugin">
  Size for document: {size}
</div>

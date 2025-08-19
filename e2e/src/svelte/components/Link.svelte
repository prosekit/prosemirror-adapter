<script lang="ts">
  import { useMarkViewContext } from '@prosemirror-adapter/svelte'

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

  let color = $state(colors[0])

  let contentRef = useMarkViewContext('contentRef')
  let mark = useMarkViewContext('mark')
  let href = $derived($mark.attrs.href as string)
  let title = $derived($mark.attrs.title as string | null)

  $effect(() => {
    const interval = setInterval(() => {
      color = pickRandomColor()
    }, 1000)

    return () => clearInterval(interval)
  })
</script>

<a {href} {title} aria-label={title} use:contentRef style="color: {color}; transition: color 1s ease-in-out"></a>

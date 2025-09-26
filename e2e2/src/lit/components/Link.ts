import { ShallowLitElement, useMarkViewContext } from '@prosemirror-adapter/lit'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { ref } from 'lit/directives/ref.js'

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

@customElement('my-link')
export class Link extends ShallowLitElement {
  markViewContext = useMarkViewContext(this)

  @state()
  color = colors[0]

  timer: ReturnType<typeof setInterval> | null = null

  override render() {
    const ctx = this.markViewContext.value
    if (!ctx) return
    const { contentRef } = ctx
    return html`<a style="color: ${this.color}; transition: color 1s ease-in-out;" ${ref(contentRef)}></a>`
  }

  override connectedCallback() {
    super.connectedCallback()
    this.timer = setInterval(() => {
      this.color = pickRandomColor()
    }, 1000)
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-link': Link
  }
}

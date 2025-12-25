import { useExtraContext } from './context'

export function Now() {
  const now = useExtraContext()
  return <div data-test-id="now-view-plugin">Now: {now}</div>
}

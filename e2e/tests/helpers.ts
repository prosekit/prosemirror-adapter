import { test } from '@playwright/test'

const FRAMEWORKS = ['lit', 'preact', 'react', 'solid', 'svelte', 'vue']

export function testAll(fn: VoidFunction, frameworks: string[] = FRAMEWORKS) {
  for (const framework of frameworks) {
    test.describe(framework, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/${framework}/`, { waitUntil: 'domcontentloaded' })
      })
      fn()
    })
  }
}

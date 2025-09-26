import { expect, test } from '@playwright/test'

import { testAll } from '../tests/helpers'

testAll(() => {
  test('link mark view render', async ({ page }) => {
    const locator = page.locator('.editor [data-mark-view-root="true"] a [data-mark-view-content="true"]')
    await expect(locator).toBeVisible()
    await expect(locator).toContainText('links')
  })

  test('link mark view update', async ({ page }) => {
    const locator = page.locator('.editor [data-mark-view-root="true"] a')
    await expect(locator).toBeVisible()

    async function getStyleColor(): Promise<string> {
      return await locator.evaluate((el) => window.getComputedStyle(el).getPropertyValue('color'))
    }

    // Expect the color to change at least 2 times
    const colors = new Set<string>()
    for (let i = 0; i < 100; i++) {
      colors.add(await getStyleColor())
      if (colors.size > 2) {
        break
      }
      await page.waitForTimeout(100)
    }
    expect(colors.size).toBeGreaterThan(2)
  })
})

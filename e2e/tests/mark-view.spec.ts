import { expect, test } from '@playwright/test'
import { testAll } from './helpers'

testAll(() => {
  test('link mark view render', async ({ page }) => {
    const locator = page.locator('.editor [data-mark-view-root="true"] a [data-mark-view-content="true"]')
    await expect(locator).toBeVisible()
    await expect(locator).toContainText('links')
  })

  test('link mark view update', async ({ page }) => {
    const locator = page.locator('.editor [data-mark-view-root="true"]')
    await expect(locator).toContainText('hover count: 0')

    // Hover the link mark view
    await locator.hover()
    await expect(locator).toContainText('hover count: 1')

    // Leave the link mark view by hovering over something else
    await page.locator('.editor h3').hover()
    await expect(locator).toContainText('hover count: 1')

    // Hover the link mark view again
    await locator.hover()
    await expect(locator).toContainText('hover count: 2')
  })
}, /* TODO: remove this once we have implemented mark view for other frameworks */ ['react'])

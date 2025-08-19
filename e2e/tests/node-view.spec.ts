import { expect, test } from '@playwright/test'

import { testAll } from './helpers'

testAll(() => {
  test('heading node view render', async ({ page }) => {
    const locator = page.locator(
      '.editor [data-node-view-root="true"] h3 [data-node-view-content="true"]',
    )
    await expect(locator).toBeVisible()
    await expect(locator).toContainText('Hello ProseMirror')
  })

  test('paragraph node view render', async ({ page }) => {
    const locator = page.locator(
      '.editor blockquote [data-node-view-root="true"] p[data-node-view-content="true"]',
    )
    await expect(locator).toBeVisible()
    await expect(locator).toContainText('This is editable text')
  })

  test('heading node view update', async ({ page }) => {
    await expect(page.locator('.editor')).toBeVisible()

    const h3 = page.locator('.editor [data-node-view-root="true"] h3')
    const h4 = page.locator('.editor [data-node-view-root="true"] h4')
    const h5 = page.locator('.editor [data-node-view-root="true"] h5')

    await h3.click()
    await page.keyboard.press('Control+a')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ControlOrMeta+[')
    await expect(h4).toBeVisible()

    await page.keyboard.press('Control+a')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ControlOrMeta+[')
    await expect(h5).toBeVisible()
  })
})

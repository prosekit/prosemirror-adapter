import { expect, test } from '@playwright/test'

import { testAll } from './helpers'

testAll(() => {
  test('Size plugin view render', async ({ page }) => {
    await expect(page.locator('.editor [data-test-id="size-view-plugin"]')).toContainText('Size for document: 523')

    await page.locator('.editor p').first().click()
    await page.keyboard.type('OK')
    await expect(page.locator('.editor [data-test-id="size-view-plugin"]')).toContainText('Size for document: 525')

    await page.keyboard.press('Backspace')
    await expect(page.locator('.editor [data-test-id="size-view-plugin"]')).toContainText('Size for document: 524')
  })
})

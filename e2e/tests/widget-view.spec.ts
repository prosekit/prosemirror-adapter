import { expect, test } from '@playwright/test'

import { testAll } from './helpers'

testAll(() => {
  test('Focus heading to render widget', async ({ page }) => {
    await page.locator('.editor h3').click()
    await expect(page.locator('i[data-widget-view-root="true"]')).toContainText(
      '###',
    )

    await page.locator('.editor').click()
    await expect(
      page.locator('i[data-widget-view-root="true"]'),
    ).not.toBeVisible()

    await page.locator('.editor h3').click()
    await page.keyboard.press('Enter')
    await page.keyboard.type('# Heading 1')
    await expect(page.locator('i[data-widget-view-root="true"]')).toContainText(
      '#',
    )
  })
})

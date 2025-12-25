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

  test('Render context from parent component', async ({ page }) => {
    const locator = page.locator('.editor [data-test-id="now-view-plugin"]')

    // Expect the <Now> component itself to render
    await expect(locator).toContainText(/Now/)

    // Expect the <Now> component can receive the context from the parent component
    await expect(locator).toContainText(/\d{2}:\d{2}:\d{2}/)

    // Expect the <Now> component can update the context from the parent component
    const text = await locator.textContent()
    const now = text?.match(/\d{2}:\d{2}:\d{2}/)?.[0] || ''
    expect(now).toHaveLength(8)
    await page.waitForTimeout(1000)
    await expect(locator).not.toContainText(new RegExp(now))
  })
})

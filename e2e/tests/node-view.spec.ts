import { expect, test } from '@playwright/test'

import { testAll } from './helpers'

testAll(() => {
  test('heading node view render', async ({ page }) => {
    const locator = page.locator('.editor [data-node-view-root="true"] h3 [data-node-view-content="true"]')
    await expect(locator).toBeVisible()
    await expect(locator).toContainText('Hello ProseMirror')
  })

  test('paragraph node view render', async ({ page }) => {
    const locator = page.locator('.editor blockquote [data-node-view-root="true"] p[data-node-view-content="true"]')
    await expect(locator).toBeVisible()
    await expect(locator).toContainText('This is editable text')
  })

  test('heading node view update', async ({ page }) => {
    await expect(page.locator('.editor')).toBeVisible()

    const h3 = page.locator('.editor [data-node-view-root="true"] h3')
    const h4 = page.locator('.editor [data-node-view-root="true"] h4')
    const h5 = page.locator('.editor [data-node-view-root="true"] h5')

    await expect(h3).toBeVisible()
    await expect(h4).not.toBeVisible()
    await expect(h5).not.toBeVisible()

    await h3.click()
    await page.keyboard.press('ControlOrMeta+[')

    await expect(h3).not.toBeVisible()
    await expect(h4).toBeVisible()
    await expect(h5).not.toBeVisible()

    await h4.click()
    await page.keyboard.press('ControlOrMeta+[')

    await expect(h3).not.toBeVisible()
    await expect(h4).not.toBeVisible()
    await expect(h5).toBeVisible()
  })

  test('node selection applies ProseMirror default selected node behavior', async ({ page }) => {
    const headingNodeView = page.locator('.editor [data-node-view-root="true"]').first()
    await expect(headingNodeView).toBeVisible()

    await page.evaluate(() => {
      ;(window as unknown as { __selectNodeByType: (typeName: string) => void }).__selectNodeByType('heading')
    })

    await expect(headingNodeView).toHaveClass(/ProseMirror-selectednode/)
    await expect(headingNodeView).toHaveAttribute('draggable', 'true')

    await page.evaluate(() => {
      ;(window as unknown as { __setTextSelection: () => void }).__setTextSelection()
    })

    await expect(headingNodeView).not.toHaveClass(/ProseMirror-selectednode/)
    await expect(headingNodeView).not.toHaveAttribute('draggable', 'true')
  })
})

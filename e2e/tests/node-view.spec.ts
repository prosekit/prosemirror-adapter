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
})

testAll(() => {
  test('react node view controls root and content DOM attributes', async ({ page }) => {
    const root = page.locator('.editor blockquote [data-node-view-root="true"][data-react-node-view-root="true"]')
    const content = root.locator('[data-node-view-content="true"][data-react-node-view-content="true"]')
    const anchor = root.locator('[data-node-view-content-anchor="true"]')

    await expect(root).toBeVisible()
    await expect(root).toHaveAttribute('role', 'presentation')
    await expect(root).toHaveAttribute('aria-hidden', 'true')
    await expect(root).toHaveCSS('width', '10px')
    await expect(content).toBeVisible()
    await expect(content).toHaveClass(/react-node-view-content/)
    await expect(anchor).not.toHaveClass(/react-node-view-content/)
  })

  test('react node view warns when mixing contentRef and NodeViewContent', async ({ page }) => {
    const warnings: string[] = []

    page.on('console', (message) => {
      if (message.type() === 'warning') {
        warnings.push(message.text())
      }
    })

    await page.goto('/stories/react/app/react?mixed-content-ref=true', { waitUntil: 'domcontentloaded' })

    await expect
      .poll(() => warnings.some((warning) => warning.includes('Do not mix contentRef and NodeViewContent')))
      .toBe(true)
  })
}, ['react'])

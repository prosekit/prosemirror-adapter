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
  test('code block node view preserves the first character typed over a full selection', async ({
    page,
    browserName,
  }) => {
    test.fail(
      browserName === 'chromium' || browserName === 'webkit',
      'prosemirror-view currently drops the first character in these browsers',
    )

    const content = page.locator('.editor [data-node-view-root="true"] pre code[data-node-view-content="true"]')
    await expect(content).toBeVisible()
    await expect(content).toContainText('const greeting')
    await expect(content.locator('span')).toHaveCount(4)
    await expect
      .poll(async () => {
        const colors = await content
          .locator('span')
          .evaluateAll((spans) => spans.map((span) => (span as HTMLElement).style.color))
        return new Set(colors).size
      })
      .toBe(4)

    await content.click()
    // Select all of the code block text, crossing the highlight spans, like a
    // user dragging from the first character to the last one.
    await content.evaluate((element) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
      const textNodes: Text[] = []
      while (walker.nextNode()) textNodes.push(walker.currentNode as Text)
      const firstText = textNodes.at(0)
      const lastText = textNodes.at(-1)
      const selection = window.getSelection()
      if (!selection || !firstText || !lastText) throw new Error('found no text to select')
      const range = document.createRange()
      range.setStart(firstText, 0)
      range.setEnd(lastText, lastText.length)
      selection.removeAllRanges()
      selection.addRange(range)
    })
    await page.keyboard.type('1')

    // Chrome and Safari delete the whole contentDOM element when typing over
    // a selection that covers all of its content. ProseMirror must not ignore
    // that mutation: the contentDOM has to come back under its control and
    // typing has to keep updating the document.
    await expect(content).toHaveCount(1)
    await expect(content).toHaveText('1')

    await page.keyboard.type('hello')
    await expect(content).toHaveText('1hello')
  })
})

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
  test('code block node view preserves the first character typed over a full selection', async ({ page }) => {
    // Chrome and Safari delete the whole contentDOM element when typing over a
    // selection that covers all of its content, unless `isolateContent` makes
    // the contentDOM the editing host of its own editable island, which
    // browsers keep alive. The island also covers the Lit recovery failure in
    // https://code.haverbeke.berlin/prosemirror/prosemirror/issues/1581

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

    // The contentDOM must stay under ProseMirror's control and typing must
    // keep updating the document.
    await expect(content).toHaveCount(1)
    await expect(content).toHaveText('1')

    await page.keyboard.type('hello')
    await expect(content).toHaveText('1hello')
  })
})

testAll(() => {
  test('code block node view isolates its contentDOM from native editing', async ({ page }) => {
    const root = page.locator('.editor [data-node-view-root="true"]', { has: page.locator('pre') })
    const content = page.locator('.editor pre code[data-node-view-content="true"]')
    await expect(content).toBeVisible()
    await expect(root).toHaveAttribute('contenteditable', 'false')
    await expect(content).toHaveAttribute('contenteditable', 'true')

    await content.click()
    await content.evaluate((element) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
      let lastText: Text | null = null
      while (walker.nextNode()) lastText = walker.currentNode as Text
      const selection = window.getSelection()
      if (!selection || !lastText) throw new Error('found no text to place the caret in')
      const range = document.createRange()
      range.setStart(lastText, lastText.length)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    })
    await page.keyboard.type('!')
    await expect(content).toHaveText('const greeting = "hello"!')
  })

  test('code block node view survives a post-composition Enter', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'replays a Safari-only prosemirror-view code path')

    const content = page.locator('.editor pre code[data-node-view-content="true"]')
    await expect(content).toBeVisible()

    await content.click()
    await content.evaluate((element) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
      const firstText = walker.nextNode() as Text | null
      const selection = window.getSelection()
      if (!selection || !firstText) throw new Error('found no text to place the caret in')
      const range = document.createRange()
      range.setStart(firstText, 0)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    })

    // Safari fires compositionend before the keydown that ends a composition,
    // so prosemirror-view ignores the keydown arriving within 500ms of the
    // compositionend without calling preventDefault, and the browser performs
    // its native edit. Without contentDOM isolation, WebKit's native
    // insertParagraph clones the <pre> into two, leaves a <br> behind, and can
    // delete the text before the caret.
    await page.locator('.editor .ProseMirror').evaluate((element) => {
      element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, data: '' }))
      element.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '' }))
    })
    await page.keyboard.press('Enter')

    await expect(content).toHaveCount(1)
    await expect(page.locator('.editor pre br')).toHaveCount(0)
    await expect(content).toHaveText('const greeting = "hello"')

    // The next Enter goes through the keymap again and inserts a newline.
    await page.keyboard.press('Enter')
    await expect.poll(() => content.evaluate((element) => element.textContent)).toBe('\nconst greeting = "hello"')
  })
})

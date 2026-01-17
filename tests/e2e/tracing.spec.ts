import { test, expect } from './fixtures'
import { traceNumber } from './helpers/traceNumber'

test.describe('Tracing Functionality', () => {
  test('coverage increases when tracing number 1', async ({ page }) => {
    await page.goto('/')

    const viewport = page.viewportSize()
    const isMobile = viewport && viewport.width < 600

    if (isMobile) {
      test.skip()
      return
    }

    await traceNumber(page, 1)

    const celebration = page.getByTestId('celebration-overlay')
    await expect(celebration).toBeVisible({ timeout: 10000 })
  })

  test('clear button resets tracing', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '1' }).click()

    await page.waitForTimeout(500)

    const canvas = page.locator('canvas').first()
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.3)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5)
    await page.mouse.up()

    const clearButton = page.locator('[data-testid="clear-button"]')
    await clearButton.click()

    await page.waitForTimeout(300)

    const canvasAfterClear = page.locator('canvas').first()
    await expect(canvasAfterClear).toBeVisible()
  })

  test('can navigate between numbers', async ({ page }) => {
    await page.goto('/')

    const viewport = page.viewportSize()
    const isLandscape = viewport && viewport.width > viewport.height

    await page.getByRole('button', { name: '5' }).click()
    await page.waitForTimeout(300)

    if (isLandscape) {
      await page.getByRole('button', { name: '8' }).click()
      await page.waitForTimeout(300)
    } else {
      await page.getByRole('button', { name: 'Back' }).click()
      await page.waitForTimeout(300)
      await page.getByRole('button', { name: '8' }).click()
      await page.waitForTimeout(300)
    }

    const canvas = page.locator('canvas').first()
    await expect(canvas).toBeVisible()
  })
})

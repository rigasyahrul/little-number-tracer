import { test, expect } from '@playwright/test'

test.describe('Tracing Functionality', () => {
  test('coverage increases when tracing number 1', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '1' }).click()

    await page.waitForTimeout(500)

    const canvas = page.locator('canvas').first()
    const box = await canvas.boundingBox()

    if (!box) throw new Error('Canvas not found')

    const startX = box.x + box.width * 0.5
    const startY = box.y + box.height * 0.15
    const endY = box.y + box.height * 0.85

    await page.mouse.move(startX, startY)
    await page.mouse.down()

    for (let y = startY; y <= endY; y += 10) {
      await page.mouse.move(startX, y)
      await page.waitForTimeout(10)
    }

    await page.mouse.up()

    const celebration = page.locator('text=Great Job!')
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

    const clearButton = page.locator('[title="Clear"]')
    await clearButton.click()

    await page.waitForTimeout(300)

    const canvasAfterClear = page.locator('canvas').first()
    await expect(canvasAfterClear).toBeVisible()
  })

  test('can navigate between numbers', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: '5' }).click()
    await page.waitForTimeout(300)

    await page.getByRole('button', { name: '8' }).click()
    await page.waitForTimeout(300)

    const canvas = page.locator('canvas').first()
    await expect(canvas).toBeVisible()
  })
})

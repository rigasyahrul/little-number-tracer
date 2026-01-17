import { test, expect, devices } from '@playwright/test'

test.use({ ...devices['iPad Pro 11'] })

test.describe('Touch Tracing', () => {
  test('touch tracing works on tablet', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '1' }).click()

    await page.waitForTimeout(500)

    const canvas = page.locator('canvas').first()
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')

    await page.evaluate(
      async ({ x, startY, endY }) => {
        const el = document.elementFromPoint(x, startY)
        if (!el) return

        const touchStart = new Touch({
          identifier: 1,
          target: el,
          clientX: x,
          clientY: startY,
        })

        el.dispatchEvent(
          new TouchEvent('touchstart', {
            bubbles: true,
            touches: [touchStart],
          })
        )

        for (let y = startY; y <= endY; y += 20) {
          const touchMove = new Touch({
            identifier: 1,
            target: el,
            clientX: x,
            clientY: y,
          })
          el.dispatchEvent(
            new TouchEvent('touchmove', {
              bubbles: true,
              touches: [touchMove],
            })
          )
          await new Promise((r) => setTimeout(r, 10))
        }

        el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [] }))
      },
      {
        x: box.x + box.width * 0.5,
        startY: box.y + box.height * 0.2,
        endY: box.y + box.height * 0.8,
      }
    )

    const celebration = page.locator('text=Great Job!')
    const greenIndicator = page.locator('[class*="bg-primary-green"]')
    await expect(celebration.or(greenIndicator)).toBeVisible({ timeout: 10000 })
  })
})

import { test, expect } from '@playwright/test'

test.describe('Detection Point Alignment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  for (let num = 0; num <= 9; num++) {
    test(`number ${num} points align with stroke`, async ({ page }) => {
      await page.getByRole('button', { name: String(num) }).click()

      await page.waitForTimeout(500)

      const debugBtn = page.locator('text=🐛')
      if (await debugBtn.isVisible()) {
        await debugBtn.click()
        await page.locator('text=Show Points').click()
      }

      await page.waitForTimeout(300)

      const canvas = page.locator('.border-primary-yellow').first()
      await expect(canvas).toHaveScreenshot(`number-${num}-points.png`, {
        maxDiffPixelRatio: 0.02,
      })
    })
  }
})

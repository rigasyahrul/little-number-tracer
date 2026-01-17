import { test, expect } from './fixtures'

test.describe('Detection Point Alignment', () => {
  for (let num = 0; num <= 9; num++) {
    test(`number ${num} points align with stroke`, async ({ page }) => {
      await page.goto('/')
      await page.getByRole('button', { name: String(num) }).click()

      await page.waitForTimeout(500)

      const showPointsBtn = page.getByTestId('debug-show-points')
      await showPointsBtn.click()

      await page.waitForTimeout(300)

      const canvas = page.locator('.border-primary-yellow').first()
      await expect(canvas).toHaveScreenshot(`number-${num}-points.png`, {
        maxDiffPixelRatio: 0.02,
      })
    })
  }
})

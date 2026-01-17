import { test, expect } from '@playwright/test'

const viewports = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'tablet-portrait', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
]

test.describe('Responsive Point Alignment', () => {
  for (const viewport of viewports) {
    test(`number 3 aligns on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')
      await page.getByRole('button', { name: '3' }).click()

      await page.waitForTimeout(500)

      const debugBtn = page.locator('text=🐛')
      if (await debugBtn.isVisible()) {
        await debugBtn.click()
        await page.locator('text=Show Points').click()
      }

      await page.waitForTimeout(300)

      await expect(page.locator('.border-primary-yellow').first())
        .toHaveScreenshot(`number-3-${viewport.name}.png`, {
          maxDiffPixelRatio: 0.02,
        })
    })
  }
})

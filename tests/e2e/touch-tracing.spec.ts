import { test, expect } from './fixtures'
import { devices } from '@playwright/test'
import { traceNumber } from './helpers/traceNumber'

test.use({ ...devices['iPad Pro 11'] })

test.describe('Touch Tracing', () => {
  test('touch tracing works on tablet', async ({ page }) => {
    await page.goto('/')

    await traceNumber(page, 1)

    const celebration = page.getByTestId('celebration-overlay')
    await expect(celebration).toBeVisible({ timeout: 10000 })
  })
})

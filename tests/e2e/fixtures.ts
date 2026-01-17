/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect } from '@playwright/test'

declare global {
  interface Window {
    _PLAYWRIGHT_TEST_?: boolean
  }
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      window._PLAYWRIGHT_TEST_ = true
    })
    await use(page)
  },
})

export { expect }

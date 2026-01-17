# Plan: Add Playwright Testing

## Overview
Add Playwright for end-to-end testing of the number tracing app, focusing on visual alignment verification and user interaction testing.

## Why Playwright?

1. **Visual regression testing** - Screenshot comparisons to verify detection points align with stroke paths
2. **Touch/pointer simulation** - Test actual tracing gestures on canvas
3. **Cross-browser** - Test on Chromium, Firefox, WebKit (Safari)
4. **Mobile emulation** - Test tablet/phone viewports
5. **CI/CD ready** - Easy integration with GitHub Actions

## Phase 1: Setup (30 min)

### Install Dependencies
```bash
npm install -D @playwright/test
npx playwright install
```

### Create Config
```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPad Pro 11'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Add Scripts to package.json
```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug"
  }
}
```

## Phase 2: Visual Alignment Tests (1-2 hours)

### Test: Detection Points Align with Stroke Path
```ts
// tests/e2e/point-alignment.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Detection Point Alignment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  for (let num = 0; num <= 9; num++) {
    test(`number ${num} points align with stroke`, async ({ page }) => {
      // Click on number in gallery
      await page.getByRole('button', { name: String(num) }).click()
      
      // Enable debug mode (only visible in dev)
      const debugBtn = page.locator('text=Debug')
      if (await debugBtn.isVisible()) {
        await debugBtn.click()
        await page.locator('text=Show Points').click()
      }
      
      // Take screenshot for visual comparison
      const canvas = page.locator('[class*="border-primary-yellow"]')
      await expect(canvas).toHaveScreenshot(`number-${num}-points.png`, {
        maxDiffPixelRatio: 0.01,
      })
    })
  }
})
```

### Test: Responsive Alignment
```ts
// tests/e2e/responsive-alignment.spec.ts
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
      
      // Enable show points
      const debugBtn = page.locator('text=Debug')
      if (await debugBtn.isVisible()) {
        await debugBtn.click()
        await page.locator('text=Show Points').click()
      }
      
      await expect(page.locator('[class*="border-primary-yellow"]'))
        .toHaveScreenshot(`number-3-${viewport.name}.png`)
    })
  }
})
```

## Phase 3: Tracing Interaction Tests (2-3 hours)

### Test: Coverage Increases When Tracing
```ts
// tests/e2e/tracing.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Tracing Functionality', () => {
  test('coverage increases when tracing number 1', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '1' }).click()
    
    // Get canvas element
    const canvas = page.locator('canvas').first()
    const box = await canvas.boundingBox()
    
    if (!box) throw new Error('Canvas not found')
    
    // Simulate drawing a vertical line (number 1)
    const startX = box.x + box.width * 0.5
    const startY = box.y + box.height * 0.15
    const endY = box.y + box.height * 0.85
    
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    
    // Draw slowly to register points
    for (let y = startY; y <= endY; y += 10) {
      await page.mouse.move(startX, y)
      await page.waitForTimeout(10)
    }
    
    await page.mouse.up()
    
    // Check coverage increased (via debug panel or celebration)
    // Either coverage > 90% or celebration shows
    const celebration = page.locator('text=Great Job')
    const debugCoverage = page.locator('text=Coverage')
    
    await expect(
      celebration.or(debugCoverage.locator('xpath=..').locator('text=/[89][0-9]%|100%/'))
    ).toBeVisible({ timeout: 5000 })
  })

  test('clear button resets tracing', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '1' }).click()
    
    // Draw something
    const canvas = page.locator('canvas').first()
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')
    
    await page.mouse.move(box.x + 100, box.y + 100)
    await page.mouse.down()
    await page.mouse.move(box.x + 200, box.y + 200)
    await page.mouse.up()
    
    // Click clear
    await page.locator('[title="Clear"]').click()
    
    // Verify reset (coverage should be 0% or drawing cleared)
    // This would need debug panel visible
  })
})
```

### Test: Touch Events (Mobile)
```ts
// tests/e2e/touch-tracing.spec.ts
import { test, expect, devices } from '@playwright/test'

test.use({ ...devices['iPad Pro 11'] })

test('touch tracing works on tablet', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '1' }).click()
  
  const canvas = page.locator('canvas').first()
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')
  
  // Simulate touch gesture
  await page.touchscreen.tap(box.x + box.width * 0.5, box.y + box.height * 0.2)
  
  // Swipe down
  const startY = box.y + box.height * 0.2
  const endY = box.y + box.height * 0.8
  
  await page.evaluate(async ({ x, startY, endY }) => {
    const el = document.elementFromPoint(x, startY)
    if (!el) return
    
    const touchStart = new Touch({
      identifier: 1,
      target: el,
      clientX: x,
      clientY: startY,
    })
    
    el.dispatchEvent(new TouchEvent('touchstart', {
      bubbles: true,
      touches: [touchStart],
    }))
    
    // Move in steps
    for (let y = startY; y <= endY; y += 20) {
      const touchMove = new Touch({
        identifier: 1,
        target: el,
        clientX: x,
        clientY: y,
      })
      el.dispatchEvent(new TouchEvent('touchmove', {
        bubbles: true,
        touches: [touchMove],
      }))
      await new Promise(r => setTimeout(r, 10))
    }
    
    el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [] }))
  }, { x: box.x + box.width * 0.5, startY, endY })
  
  // Verify tracing registered
  await expect(page.locator('text=Great Job').or(page.locator('[class*="bg-primary-green"]'))).toBeVisible({ timeout: 5000 })
})
```

## Phase 4: CI/CD Integration (30 min)

### GitHub Actions Workflow
```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
        
      - name: Build app
        run: npm run build
        
      - name: Run Playwright tests
        run: npm test
        
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Directory Structure

```
little-number-tracer/
├── tests/
│   └── e2e/
│       ├── point-alignment.spec.ts
│       ├── responsive-alignment.spec.ts
│       ├── tracing.spec.ts
│       ├── touch-tracing.spec.ts
│       └── snapshots/
│           ├── number-0-points.png
│           ├── number-1-points.png
│           └── ...
├── playwright.config.ts
└── package.json
```

## Estimated Effort

| Phase | Task | Time |
|-------|------|------|
| 1 | Setup & Config | 30 min |
| 2 | Visual Alignment Tests | 1-2 hours |
| 3 | Tracing Interaction Tests | 2-3 hours |
| 4 | CI/CD Integration | 30 min |
| **Total** | | **4-6 hours** |

## Success Criteria

- [ ] All 10 numbers have baseline screenshots
- [ ] Visual regression catches point misalignment
- [ ] Tracing tests verify coverage detection works
- [ ] Tests pass on desktop and tablet viewports
- [ ] CI runs tests on every PR

## Notes

- Screenshots will need to be regenerated after fixing point alignment
- Debug mode must be enabled for visual alignment tests (dev only)
- Consider adding `data-testid` attributes for more stable selectors

import { test, expect } from './fixtures'

async function openFreeDraw(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Free Draw Mode' }).click()
  await expect(page.locator('canvas').first()).toBeVisible()
}

async function drawStroke(page: import('@playwright/test').Page) {
  const canvas = page.locator('[data-testid="free-draw-canvas"]')
  await expect(canvas).toBeVisible()
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Free draw canvas not found')

  const startX = box.x + box.width * 0.25
  const startY = box.y + box.height * 0.4
  const endX = box.x + box.width * 0.75
  const endY = box.y + box.height * 0.6

  // Use pointer events so WebKit/iPad projects receive strokes (mouse alone is unreliable)
  await page.evaluate(
    ({ sx, sy, ex, ey }) => {
      const el = document.querySelector(
        '[data-testid="free-draw-canvas"]'
      ) as HTMLCanvasElement | null
      if (!el) throw new Error('canvas missing')

      const fire = (
        type: string,
        x: number,
        y: number,
        buttons: number
      ) => {
        el.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            pointerId: 1,
            pointerType: 'touch',
            isPrimary: true,
            buttons,
            pressure: buttons ? 0.5 : 0,
          })
        )
      }

      fire('pointerdown', sx, sy, 1)
      const steps = 12
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        fire('pointermove', sx + (ex - sx) * t, sy + (ey - sy) * t, 1)
      }
      fire('pointerup', ex, ey, 0)
    },
    { sx: startX, sy: startY, ex: endX, ey: endY }
  )

  // Stroke should leave ink immediately
  await expect.poll(async () => canvasHasInk(page), { timeout: 5000 }).toBe(true)

  // Wait until IndexedDB has a free-draw snapshot (ArrayBuffer `data` or legacy `blob`)
  await expect
    .poll(
      async () =>
        page.evaluate(async () => {
          return new Promise<boolean>((resolve) => {
            const req = indexedDB.open('NumberTracerFreeDrawDB')
            req.onerror = () => resolve(false)
            req.onsuccess = () => {
              const db = req.result
              if (!db.objectStoreNames.contains('canvas')) {
                resolve(false)
                return
              }
              const tx = db.transaction('canvas', 'readonly')
              const getReq = tx.objectStore('canvas').get('current')
              getReq.onsuccess = () => {
                const r = getReq.result
                resolve(!!(r && (r.data || r.blob)))
              }
              getReq.onerror = () => resolve(false)
            }
          })
        }),
      { timeout: 5000 }
    )
    .toBe(true)
}

async function openMenu(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /drawing menu|Close menu/i }).click()
}

async function canvasHasInk(page: import('@playwright/test').Page): Promise<boolean> {
  return page.locator('[data-testid="free-draw-canvas"]').evaluate((el) => {
    const canvas = el as HTMLCanvasElement
    const ctx = canvas.getContext('2d')
    if (!ctx) return false
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // Any non-white / non-transparent pixel counts as ink
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]
      if (a > 10 && (r < 250 || g < 250 || b < 250)) return true
    }
    return false
  })
}

test.describe('Free Draw', () => {
  test('keeps drawing after Back and re-open', async ({ page }) => {
    await openFreeDraw(page)
    await drawStroke(page)
    expect(await canvasHasInk(page)).toBe(true)

    await page.getByRole('button', { name: 'Back' }).click()
    await expect(page.getByRole('button', { name: 'Free Draw Mode' })).toBeVisible()

    await page.getByRole('button', { name: 'Free Draw Mode' }).click()
    await expect(page.locator('[data-testid="free-draw-canvas"]')).toBeVisible()
    // Wait for restore from storage
    await expect
      .poll(async () => canvasHasInk(page), { timeout: 5000 })
      .toBe(true)
  })

  test('keeps drawing after page reload', async ({ page }) => {
    await openFreeDraw(page)
    await drawStroke(page)
    expect(await canvasHasInk(page)).toBe(true)

    await page.reload()
    // App opens on gallery; free draw should still restore when opened
    await page.getByRole('button', { name: 'Free Draw Mode' }).click()
    await expect(page.locator('[data-testid="free-draw-canvas"]')).toBeVisible()
    await expect
      .poll(async () => canvasHasInk(page), { timeout: 5000 })
      .toBe(true)
  })

  test('clear removes drawing and does not restore it', async ({ page }) => {
    await openFreeDraw(page)
    await drawStroke(page)
    expect(await canvasHasInk(page)).toBe(true)

    await openMenu(page)
    await page.getByRole('button', { name: 'Clear All' }).click()
    await page.waitForTimeout(400)

    expect(await canvasHasInk(page)).toBe(false)

    // Snapshot should be gone
    await expect
      .poll(
        async () =>
          page.evaluate(async () => {
            return new Promise<boolean>((resolve) => {
              const req = indexedDB.open('NumberTracerFreeDrawDB')
              req.onerror = () => resolve(true)
              req.onsuccess = () => {
                const db = req.result
                if (!db.objectStoreNames.contains('canvas')) {
                  resolve(true)
                  return
                }
                const tx = db.transaction('canvas', 'readonly')
                const getReq = tx.objectStore('canvas').get('current')
                getReq.onsuccess = () => resolve(!getReq.result)
                getReq.onerror = () => resolve(true)
              }
            })
          }),
        { timeout: 5000 }
      )
      .toBe(true)

    await page.getByRole('button', { name: 'Back' }).click()
    await page.getByRole('button', { name: 'Free Draw Mode' }).click()
    await page.waitForTimeout(800)
    expect(await canvasHasInk(page)).toBe(false)
  })

  test('Save Image uses blob download (not data-URL only)', async ({ page }) => {
    await openFreeDraw(page)
    await drawStroke(page)

    await openMenu(page)

    const downloadPromise = page.waitForEvent('download', { timeout: 10000 })
    await page.getByRole('button', { name: 'Save Image' }).click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toMatch(/^free-draw-\d+\.png$/)
    const path = await download.path()
    expect(path).toBeTruthy()

    // Page should still be on free draw (not navigated away)
    await expect(page.locator('[data-testid="free-draw-canvas"]')).toBeVisible()
  })
})

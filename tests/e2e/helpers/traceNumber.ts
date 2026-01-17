import type { Page } from '@playwright/test'
import { numberDefinitions } from '../../../src/data/numberDefinitions'

interface Point {
  x: number
  y: number
}

interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

function toScreenCoords(box: BoundingBox, normalizedPoint: Point): Point {
  return {
    x: box.x + normalizedPoint.x * box.width,
    y: box.y + normalizedPoint.y * box.height,
  }
}

async function moveInterpolated(
  page: Page,
  from: Point,
  to: Point,
  stepPx = 4
): Promise<void> {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const dist = Math.hypot(dx, dy)
  const steps = Math.max(1, Math.ceil(dist / stepPx))

  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(from.x + (dx * i) / steps, from.y + (dy * i) / steps)
  }
}

export async function traceNumber(page: Page, num: number): Promise<void> {
  await page.getByRole('button', { name: String(num) }).click()
  await page.waitForTimeout(300)

  const canvas = page.locator('canvas').first()
  await canvas.waitFor({ state: 'visible' })
  await canvas.scrollIntoViewIfNeeded()
  await page.waitForTimeout(100)
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')

  const def = numberDefinitions[num]
  if (!def) throw new Error(`No definition for number ${num}`)

  const viewport = page.viewportSize()
  const isMobile = viewport && viewport.width < 600

  for (const stroke of def.strokes) {
    const pts = stroke.points
    if (pts.length === 0) continue

    const start = toScreenCoords(box, pts[0])

    if (isMobile) {
      const normalizedPoints = pts.map((p) => ({ x: p.x, y: p.y }))

      await page.evaluate(
        ({ normalizedPts }) => {
          const canvas = document.querySelector('canvas')
          if (!canvas) return

          const rect = canvas.getBoundingClientRect()
          const points = normalizedPts.map((p) => ({
            x: rect.left + p.x * rect.width,
            y: rect.top + p.y * rect.height,
          }))

          const createPointerEvent = (
            type: string,
            x: number,
            y: number
          ): PointerEvent => {
            return new PointerEvent(type, {
              bubbles: true,
              cancelable: true,
              clientX: x,
              clientY: y,
              pointerId: 1,
              pointerType: 'touch',
              isPrimary: true,
            })
          }

          canvas.dispatchEvent(
            createPointerEvent('pointerdown', points[0].x, points[0].y)
          )

          for (let i = 1; i < points.length; i++) {
            canvas.dispatchEvent(
              createPointerEvent('pointermove', points[i].x, points[i].y)
            )
          }

          canvas.dispatchEvent(
            createPointerEvent(
              'pointerup',
              points[points.length - 1].x,
              points[points.length - 1].y
            )
          )
        },
        { normalizedPts: normalizedPoints }
      )
    } else {
      await page.mouse.move(start.x, start.y)
      await page.mouse.down()

      let prev = start
      for (let i = 1; i < pts.length; i++) {
        const next = toScreenCoords(box, pts[i])
        await moveInterpolated(page, prev, next, 4)
        prev = next
      }

      await page.mouse.up()
    }

    await page.waitForTimeout(50)
  }
}

export async function traceNumberWithTouch(
  page: Page,
  num: number
): Promise<void> {
  await page.getByRole('button', { name: String(num) }).click()
  await page.waitForTimeout(300)

  const canvas = page.locator('canvas').first()
  await canvas.waitFor({ state: 'visible' })
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')

  const def = numberDefinitions[num]
  if (!def) throw new Error(`No definition for number ${num}`)

  for (const stroke of def.strokes) {
    const pts = stroke.points
    if (pts.length === 0) continue

    const start = toScreenCoords(box, pts[0])
    await page.touchscreen.tap(start.x, start.y)

    for (let i = 1; i < pts.length; i++) {
      const pt = toScreenCoords(box, pts[i])
      await page.touchscreen.tap(pt.x, pt.y)
    }

    await page.waitForTimeout(50)
  }
}

import type { StrokePoint } from '../types/tracing'

interface SampleOptions {
  spacing?: number
  minPoints?: number
  maxPoints?: number
  includeEnd?: boolean
}

let cachedPathElement: SVGPathElement | null = null

function getPathElement(): SVGPathElement {
  if (!cachedPathElement) {
    cachedPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  }
  return cachedPathElement
}

const pointsCache = new Map<string, StrokePoint[]>()

export function sampleSvgPathPoints(
  d: string,
  opts: SampleOptions = {}
): StrokePoint[] {
  const { spacing = 2, minPoints = 12, maxPoints = 80, includeEnd = true } = opts

  const cacheKey = `${d}|${spacing}|${minPoints}|${maxPoints}|${includeEnd}`
  const cached = pointsCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const path = getPathElement()
  path.setAttribute('d', d)

  const total = path.getTotalLength()
  const targetCount = Math.max(minPoints, Math.min(maxPoints, Math.ceil(total / spacing) + 1))
  const steps = includeEnd ? targetCount - 1 : targetCount

  const points: StrokePoint[] = []
  for (let i = 0; i <= steps; i++) {
    const len = (i / steps) * total
    const p = path.getPointAtLength(len)
    points.push({ x: p.x / 100, y: p.y / 100 })
  }

  pointsCache.set(cacheKey, points)
  return points
}

export function clearSampleCache(): void {
  pointsCache.clear()
}

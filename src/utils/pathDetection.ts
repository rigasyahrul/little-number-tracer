import type { Stroke, StrokePoint } from '../types/tracing'

interface FlattenedStroke {
  points: Array<StrokePoint & { cumulativeLength: number }>
  totalLength: number
}

/**
 * Preprocess stroke to compute cumulative lengths
 */
export function flattenStroke(stroke: Stroke): FlattenedStroke {
  const points: Array<StrokePoint & { cumulativeLength: number }> = []
  let cumulativeLength = 0

  stroke.points.forEach((point, index) => {
    if (index > 0) {
      const prev = stroke.points[index - 1]
      const dx = point.x - prev.x
      const dy = point.y - prev.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      cumulativeLength += distance
    }
    points.push({
      ...point,
      cumulativeLength,
    })
  })

  return {
    points,
    totalLength: cumulativeLength,
  }
}

/**
 * Find distance to closest point on stroke path
 */
export function findClosestPointOnStroke(
  userPoint: StrokePoint,
  stroke: Stroke,
  tolerance: number = 0.15
): { distance: number; pointIndex: number; segmentProgress: number } | null {
  let minDistance = Infinity
  let closestIndex = 0

  for (let i = 0; i < stroke.points.length; i++) {
    const pathPoint = stroke.points[i]
    const dx = userPoint.x - pathPoint.x
    const dy = userPoint.y - pathPoint.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < minDistance) {
      minDistance = distance
      closestIndex = i
    }

    // Check distance to segment
    if (i < stroke.points.length - 1) {
      const nextPoint = stroke.points[i + 1]
      const segmentDist = distanceToSegment(userPoint, pathPoint, nextPoint)
      if (segmentDist < minDistance) {
        minDistance = segmentDist
        closestIndex = i
      }
    }
  }

  if (minDistance <= tolerance) {
    return {
      distance: minDistance,
      pointIndex: closestIndex,
      segmentProgress: minDistance,
    }
  }

  return null
}

/**
 * Calculate perpendicular distance from point to line segment
 */
function distanceToSegment(
  point: StrokePoint,
  a: StrokePoint,
  b: StrokePoint
): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.sqrt(dx * dx + dy * dy)

  if (len === 0) {
    return Math.sqrt((point.x - a.x) ** 2 + (point.y - a.y) ** 2)
  }

  let t = ((point.x - a.x) * dx + (point.y - a.y) * dy) / (len * len)
  t = Math.max(0, Math.min(1, t))

  const projX = a.x + t * dx
  const projY = a.y + t * dy

  const distX = point.x - projX
  const distY = point.y - projY

  return Math.sqrt(distX * distX + distY * distY)
}

/**
 * Compute path coverage and on-path ratio
 */
export function computePathCoverage(
  userStroke: Array<StrokePoint>,
  targetStroke: Stroke,
  tolerance: number = 0.15
): { onPathPoints: number; totalPoints: number; coverage: number } {
  let onPathPoints = 0
  const flatStroke = flattenStroke(targetStroke)
  const coveredIndices = new Set<number>()

  userStroke.forEach((userPoint) => {
    const closest = findClosestPointOnStroke(userPoint, targetStroke, tolerance)
    if (closest) {
      onPathPoints++
      coveredIndices.add(closest.pointIndex)
    }
  })

  // Calculate coverage as percentage of path points visited
  const coverage = coveredIndices.size / flatStroke.points.length

  return {
    onPathPoints,
    totalPoints: userStroke.length,
    coverage,
  }
}

/**
 * Check if stroke is complete based on thresholds
 */
export function isStrokeComplete(
  userStroke: Array<StrokePoint>,
  targetStroke: Stroke,
  coverageThreshold: number = 0.7,
  onPathThreshold: number = 0.5,
  tolerance: number = 0.15
): boolean {
  const metrics = computePathCoverage(userStroke, targetStroke, tolerance)

  const coverageOk = metrics.coverage >= coverageThreshold
  const onPathOk =
    metrics.totalPoints > 0
      ? metrics.onPathPoints / metrics.totalPoints >= onPathThreshold
      : false

  return coverageOk && onPathOk
}

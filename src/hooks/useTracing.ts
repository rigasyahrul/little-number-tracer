import { useState, useCallback, useRef, useMemo } from 'react'
import type { NumberDefinition, Stroke, StrokePoint } from '../types/tracing'
import { sampleSvgPathPoints } from '../utils/svgPathSampler'

function getStrokePoints(stroke: Stroke): StrokePoint[] {
  if (stroke.points && stroke.points.length > 0) {
    return stroke.points
  }
  return sampleSvgPathPoints(stroke.svgPath)
}

const PATH_TOLERANCE = 0.03
export const DEFAULT_COMPLETION_THRESHOLD = 0.99

interface TracingState {
  isComplete: boolean
  accuracy: number
  pathCoverage: number
}

interface UseTracingOptions {
  numberDef: NumberDefinition
  onComplete?: (accuracy: number) => void
  completionThreshold?: number
}

export function useTracing({ numberDef, onComplete, completionThreshold = DEFAULT_COMPLETION_THRESHOLD }: UseTracingOptions) {
  const [state, setState] = useState<TracingState>({
    isComplete: false,
    accuracy: 0,
    pathCoverage: 0,
  })

  const coveredPointsRef = useRef<Map<string, Set<number>>>(new Map())

  const strokePointsMap = useMemo(() => {
    const map = new Map<string, StrokePoint[]>()
    for (const stroke of numberDef.strokes) {
      map.set(stroke.id, getStrokePoints(stroke))
    }
    return map
  }, [numberDef])

  const getCurrentStroke = useCallback(() => {
    return numberDef.strokes[0]
  }, [numberDef])

  const getTotalPoints = useCallback(() => {
    let total = 0
    strokePointsMap.forEach((points) => {
      total += points.length
    })
    return total
  }, [strokePointsMap])

  const getTotalCovered = useCallback(() => {
    let total = 0
    coveredPointsRef.current.forEach((set) => {
      total += set.size
    })
    return total
  }, [])

  const handleStrokeChange = useCallback(
    (userPoints: Array<StrokePoint>) => {
      if (state.isComplete) return

      userPoints.forEach((userPoint) => {
        numberDef.strokes.forEach((stroke) => {
          if (!coveredPointsRef.current.has(stroke.id)) {
            coveredPointsRef.current.set(stroke.id, new Set())
          }
          const coveredSet = coveredPointsRef.current.get(stroke.id)!
          const points = strokePointsMap.get(stroke.id) ?? []

          for (let i = 0; i < points.length; i++) {
            const pathPoint = points[i]
            const dx = userPoint.x - pathPoint.x
            const dy = userPoint.y - pathPoint.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance <= PATH_TOLERANCE) {
              coveredSet.add(i)
            }
          }
        })
      })

      const totalPoints = getTotalPoints()
      const totalCovered = getTotalCovered()
      const coverage = totalCovered / totalPoints

      setState((prev) => ({
        ...prev,
        pathCoverage: coverage,
      }))
    },
    [state.isComplete, numberDef, strokePointsMap, getTotalPoints, getTotalCovered]
  )

  const handleStrokeEnd = useCallback(() => {
    if (state.isComplete) return

    const totalPoints = getTotalPoints()
    const totalCovered = getTotalCovered()
    const coverage = totalCovered / totalPoints

    if (coverage >= completionThreshold) {
      setState((prev) => ({
        ...prev,
        isComplete: true,
        accuracy: coverage,
        pathCoverage: coverage,
      }))
      onComplete?.(coverage)
    }
  }, [state.isComplete, onComplete, getTotalPoints, getTotalCovered, completionThreshold])

  const reset = useCallback(() => {
    coveredPointsRef.current = new Map()
    setState({
      isComplete: false,
      accuracy: 0,
      pathCoverage: 0,
    })
  }, [])

  return {
    state,
    getCurrentStroke,
    handleStrokeChange,
    handleStrokeEnd,
    reset,
  }
}

import { useState, useCallback, useRef } from 'react'
import type { NumberDefinition, StrokePoint } from '../types/tracing'

const PATH_TOLERANCE = 0.025
const COMPLETION_THRESHOLD = 0.99

interface TracingState {
  isComplete: boolean
  accuracy: number
  pathCoverage: number
}

interface UseTracingOptions {
  numberDef: NumberDefinition
  onComplete?: (accuracy: number) => void
}

export function useTracing({ numberDef, onComplete }: UseTracingOptions) {
  const [state, setState] = useState<TracingState>({
    isComplete: false,
    accuracy: 0,
    pathCoverage: 0,
  })

  const coveredPointsRef = useRef<Set<number>>(new Set())

  const getCurrentStroke = useCallback(() => {
    return numberDef.strokes[0]
  }, [numberDef])

  const handleStrokeChange = useCallback(
    (userPoints: Array<StrokePoint>) => {
      if (state.isComplete) return

      const stroke = numberDef.strokes[0]
      if (!stroke) return

      userPoints.forEach((userPoint) => {
        for (let i = 0; i < stroke.points.length; i++) {
          const pathPoint = stroke.points[i]
          const dx = userPoint.x - pathPoint.x
          const dy = userPoint.y - pathPoint.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance <= PATH_TOLERANCE) {
            coveredPointsRef.current.add(i)
          }
        }
      })

      const coverage = coveredPointsRef.current.size / stroke.points.length

      setState((prev) => ({
        ...prev,
        pathCoverage: coverage,
      }))
    },
    [state.isComplete, numberDef]
  )

  const handleStrokeEnd = useCallback(() => {
    if (state.isComplete) return

    const stroke = numberDef.strokes[0]
    if (!stroke) return

    const coverage = coveredPointsRef.current.size / stroke.points.length

    if (coverage >= COMPLETION_THRESHOLD) {
      setState((prev) => ({
        ...prev,
        isComplete: true,
        accuracy: coverage,
        pathCoverage: coverage,
      }))
      onComplete?.(coverage)
    }
  }, [state.isComplete, numberDef, onComplete])

  const reset = useCallback(() => {
    coveredPointsRef.current = new Set()
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

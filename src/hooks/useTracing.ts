import { useState, useCallback } from 'react'
import type { NumberDefinition, StrokePoint } from '../types/tracing'
import { isStrokeComplete } from '../utils/pathDetection'

interface TracingState {
  currentStrokeIndex: number
  isComplete: boolean
  accuracy: number
  currentStrokeOnPath: number
  currentStrokeTotal: number
}

interface UseTracingOptions {
  numberDef: NumberDefinition
  onComplete?: (accuracy: number) => void
}

export function useTracing({ numberDef, onComplete }: UseTracingOptions) {
  const [state, setState] = useState<TracingState>({
    currentStrokeIndex: 0,
    isComplete: false,
    accuracy: 0,
    currentStrokeOnPath: 0,
    currentStrokeTotal: 0,
  })

  const getCurrentStroke = useCallback(() => {
    return numberDef.strokes[state.currentStrokeIndex]
  }, [numberDef, state.currentStrokeIndex])

  const handleStrokeChange = useCallback(
    (userPoints: Array<StrokePoint>) => {
      if (state.isComplete) return

      const currentStroke = getCurrentStroke()
      if (!currentStroke) return

      // Count on-path points
      let onPathCount = 0
      userPoints.forEach((userPoint) => {
        const minDist = Math.min(
          ...currentStroke.points.map((pathPoint) => {
            const dx = userPoint.x - pathPoint.x
            const dy = userPoint.y - pathPoint.y
            return Math.sqrt(dx * dx + dy * dy)
          })
        )
        if (minDist <= 0.15) {
          onPathCount++
        }
      })

      setState((prev) => ({
        ...prev,
        currentStrokeOnPath: onPathCount,
        currentStrokeTotal: userPoints.length,
      }))
    },
    [state.isComplete, getCurrentStroke]
  )

  const handleStrokeEnd = useCallback(
    (userPoints: Array<StrokePoint>) => {
      if (state.isComplete) return

      const currentStroke = getCurrentStroke()
      if (!currentStroke) return

      const isComplete = isStrokeComplete(userPoints, currentStroke, 0.7, 0.5)

      if (isComplete) {
        const nextStrokeIndex = state.currentStrokeIndex + 1

        if (nextStrokeIndex >= numberDef.strokes.length) {
          // All strokes complete!
          const finalAccuracy =
            (state.currentStrokeOnPath + 1) /
            (state.currentStrokeTotal + 1)
          setState((prev) => ({
            ...prev,
            isComplete: true,
            accuracy: finalAccuracy,
          }))
          onComplete?.(finalAccuracy)
        } else {
          // Move to next stroke
          setState((prev) => ({
            ...prev,
            currentStrokeIndex: nextStrokeIndex,
            currentStrokeOnPath: 0,
            currentStrokeTotal: 0,
          }))
        }
      }
    },
    [state, numberDef, getCurrentStroke, onComplete]
  )

  const reset = useCallback(() => {
    setState({
      currentStrokeIndex: 0,
      isComplete: false,
      accuracy: 0,
      currentStrokeOnPath: 0,
      currentStrokeTotal: 0,
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

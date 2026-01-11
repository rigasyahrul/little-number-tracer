import { useState, useEffect } from 'react'
import { TracingCanvas } from './TracingCanvas/TracingCanvas'
import { NumberPath } from './NumberPath/NumberPath'
import { StrokeArrows } from './StrokeArrows/StrokeArrows'
import { getNumberDefinition } from '../data/numberDefinitions'
import { useTracing } from '../hooks/useTracing'
import { useProgressStore } from '../stores/progressStore'

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 500

interface TracingScreenProps {
  number: number
  onComplete: () => void
}

export function TracingScreen({ number, onComplete }: TracingScreenProps) {
  const [clearTrigger, setClearTrigger] = useState(0)
  const numberDef = getNumberDefinition(number)
  const { incrementAttempt, setCompleted } = useProgressStore()

  const {
    state,
    getCurrentStroke,
    handleStrokeChange,
    handleStrokeEnd,
    reset,
  } = useTracing({
    numberDef,
    onComplete: async (accuracy) => {
      await setCompleted(number, accuracy)
      // Show celebration would happen here
      setTimeout(() => {
        onComplete()
      }, 1500)
    },
  })

  const handleReset = () => {
    setClearTrigger((prev) => prev + 1)
    reset()
  }

  useEffect(() => {
    incrementAttempt(number)
  }, [])

  const currentStroke = getCurrentStroke()

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold text-text-dark">
        Trace the Number {number}
      </h2>

      {/* Canvas container */}
      <div
        className="relative bg-white border-4 border-primary-yellow rounded-lg shadow-lg"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        <NumberPath
          numberDef={numberDef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          highlightStrokeId={currentStroke?.id}
        />
        <StrokeArrows
          stroke={currentStroke}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          isCurrentStroke={true}
        />
        <TracingCanvas
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          clearTrigger={clearTrigger}
          onStrokeChange={(points) => {
            const normalized = points.map((p) => ({
              x: p.x / CANVAS_WIDTH,
              y: p.y / CANVAS_HEIGHT,
            }))
            handleStrokeChange(normalized)
          }}
          onStrokeEnd={(points) => {
            const normalized = points.map((p) => ({
              x: p.x / CANVAS_WIDTH,
              y: p.y / CANVAS_HEIGHT,
            }))
            handleStrokeEnd(normalized)
          }}
        />
      </div>

      {/* Status info */}
      {currentStroke && (
        <div className="text-lg font-semibold text-text-dark">
          Stroke {state.currentStrokeIndex + 1} of {numberDef.strokes.length}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-secondary-coral text-text-light rounded-xl font-bold hover:opacity-90"
        >
          Try Again
        </button>
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-primary-green text-text-light rounded-xl font-bold hover:opacity-90"
        >
          Done
        </button>
      </div>
    </div>
  )
}

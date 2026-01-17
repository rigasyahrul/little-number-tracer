import { useState, useEffect } from 'react'
import { TracingCanvas } from './TracingCanvas/TracingCanvas'
import { NumberPath } from './NumberPath/NumberPath'
import { StrokeArrows } from './StrokeArrows/StrokeArrows'
import { Mascot } from './Mascot/Mascot'
import { CelebrationOverlay } from './CelebrationOverlay/CelebrationOverlay'
import { NumberPickerSidebar } from './NumberPickerSidebar'
import { DebugPanel } from './DebugPanel'
import { getNumberDefinition } from '../data/numberDefinitions'
import { useTracing, DEFAULT_COMPLETION_THRESHOLD } from '../hooks/useTracing'
import { useProgressStore } from '../stores/progressStore'

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 500
const CANVAS_ASPECT_RATIO = CANVAS_WIDTH / CANVAS_HEIGHT

interface TracingScreenProps {
  number: number
  onComplete: () => void
  onSelectNumber?: (n: number) => void
}

export function TracingScreen({ number, onComplete, onSelectNumber }: TracingScreenProps) {
  const [clearTrigger, setClearTrigger] = useState(0)
  const [mascotState, setMascotState] = useState<'idle' | 'guiding' | 'happy' | 'celebrate'>('idle')
  const [showCelebration, setShowCelebration] = useState(false)
  const [completionThreshold, setCompletionThreshold] = useState(DEFAULT_COMPLETION_THRESHOLD)
  const [showDebugPoints, setShowDebugPoints] = useState(false)
  const [isLandscape, setIsLandscape] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth > window.innerHeight
  })
  const [landscapeCanvasSize, setLandscapeCanvasSize] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT })

  const numberDef = getNumberDefinition(number)
  const { incrementAttempt, setCompleted } = useProgressStore()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => {
      const isLand = window.innerWidth > window.innerHeight
      setIsLandscape(isLand)
      
      if (isLand) {
        const headerHeight = 70
        const padding = 20
        const availableHeight = window.innerHeight - headerHeight - padding
        const availableWidth = window.innerWidth * 0.85 - padding * 2
        
        let canvasHeight = availableHeight
        let canvasWidth = canvasHeight * CANVAS_ASPECT_RATIO
        
        if (canvasWidth > availableWidth) {
          canvasWidth = availableWidth
          canvasHeight = canvasWidth / CANVAS_ASPECT_RATIO
        }
        
        setLandscapeCanvasSize({ width: Math.floor(canvasWidth), height: Math.floor(canvasHeight) })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const {
    state,
    getCurrentStroke,
    handleStrokeChange,
    handleStrokeEnd,
    reset,
  } = useTracing({
    numberDef,
    completionThreshold,
    onComplete: async (accuracy) => {
      setMascotState('celebrate')
      setShowCelebration(true)
      await setCompleted(number, accuracy)
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
  }, [incrementAttempt, number])

  const currentStroke = getCurrentStroke()

  const canvasWidth = isLandscape ? landscapeCanvasSize.width : CANVAS_WIDTH
  const canvasHeight = isLandscape ? landscapeCanvasSize.height : CANVAS_HEIGHT

  const renderCanvas = () => (
    <div
      className="relative bg-white border-4 border-primary-yellow rounded-lg shadow-lg"
      style={{ width: canvasWidth, height: canvasHeight }}
    >
      <NumberPath
        numberDef={numberDef}
        width={canvasWidth}
        height={canvasHeight}
        highlightStrokeId={currentStroke?.id}
        showDebugPoints={showDebugPoints}
      />
      <StrokeArrows
        stroke={currentStroke}
        width={canvasWidth}
        height={canvasHeight}
        isCurrentStroke={true}
      />
      <TracingCanvas
        width={canvasWidth}
        height={canvasHeight}
        clearTrigger={clearTrigger}
        onStrokeChange={(points) => {
          const normalized = points.map((p) => ({
            x: p.x / canvasWidth,
            y: p.y / canvasHeight,
          }))
          handleStrokeChange(normalized)
        }}
        onStrokeEnd={() => {
          handleStrokeEnd()
        }}
      />
    </div>
  )

  const renderControls = () => (
    <div className="flex gap-4">
      <button
        onClick={handleReset}
        className="px-6 py-3 bg-secondary-coral text-text-light rounded-xl font-bold hover:opacity-90"
        data-testid="clear-button"
      >
        🗑️ Clear
      </button>
      <button
        onClick={onComplete}
        className="px-6 py-3 bg-primary-green text-text-light rounded-xl font-bold hover:opacity-90"
      >
        Done
      </button>
    </div>
  )

  const renderClearButtonLandscape = () => (
    <button
      onClick={handleReset}
      className="w-10 h-10 bg-red-500 text-white text-xl font-bold rounded-lg hover:bg-red-600 flex items-center justify-center"
      title="Clear"
      data-testid="clear-button"
    >
      🗑️
    </button>
  )

  const renderStrokeInfo = () =>
    currentStroke && (
      <div className={`${isLandscape ? 'text-base' : 'text-lg'} font-semibold text-text-dark`}>
        Progress: {Math.round(state.pathCoverage * 100)}%
      </div>
    )

  if (isLandscape) {
    return (
      <div className="w-full h-full flex relative">
        <CelebrationOverlay
          show={showCelebration}
          duration={typeof window !== 'undefined' && window._PLAYWRIGHT_TEST_ ? 10000 : 3000}
        />
        <DebugPanel
          coverage={state.pathCoverage}
          threshold={completionThreshold}
          onThresholdChange={setCompletionThreshold}
          showPoints={showDebugPoints}
          onTogglePoints={() => setShowDebugPoints(!showDebugPoints)}
        />

        {/* Left: Canvas area - takes 85% */}
        <div className="w-[85%] h-full flex items-center justify-center">
          {renderCanvas()}
        </div>

        {/* Right: Number picker - takes 15% */}
        {onSelectNumber && (
          <div className="w-[15%] h-full bg-background-cream/50 border-l-2 border-primary-yellow overflow-hidden">
            <NumberPickerSidebar
              selectedNumber={number}
              onSelectNumber={onSelectNumber}
            />
          </div>
        )}

        {/* Floating clear button - bottom left */}
        <div className="absolute bottom-4 left-4">
          {renderClearButtonLandscape()}
        </div>
      </div>
    )
  }

  // Portrait layout
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 relative">
      <CelebrationOverlay
        show={showCelebration}
        duration={typeof window !== 'undefined' && window._PLAYWRIGHT_TEST_ ? 10000 : 3000}
      />
      <DebugPanel
        coverage={state.pathCoverage}
        threshold={completionThreshold}
        onThresholdChange={setCompletionThreshold}
        showPoints={showDebugPoints}
        onTogglePoints={() => setShowDebugPoints(!showDebugPoints)}
      />

      <h2 className="text-4xl font-bold text-text-dark">
        Trace the Number {number}
      </h2>

      <Mascot state={mascotState} />

      {renderCanvas()}
      {renderStrokeInfo()}
      {renderControls()}
    </div>
  )
}

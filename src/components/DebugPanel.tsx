import { useState } from 'react'
import { DEFAULT_COMPLETION_THRESHOLD } from '../hooks/useTracing'

interface DebugPanelProps {
  coverage: number
  threshold: number
  onThresholdChange: (value: number) => void
  showPoints?: boolean
  onTogglePoints?: () => void
}

declare global {
  interface Window {
    _PLAYWRIGHT_TEST_?: boolean
  }
}

export function DebugPanel({ coverage, threshold, onThresholdChange, showPoints, onTogglePoints }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(true)

  // Show in development mode or when running Playwright tests
  const isPlaywrightTest = typeof window !== 'undefined' && window._PLAYWRIGHT_TEST_
  if (!import.meta.env.DEV && !isPlaywrightTest) {
    return null
  }

  const coveragePercent = Math.round(coverage * 100)
  const thresholdPercent = Math.round(threshold * 100)
  const isComplete = coverage >= threshold

  return (
    <div className="absolute top-2 left-2 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-80 hover:opacity-100"
        data-testid="debug-toggle"
      >
        🐛 {isOpen ? 'Hide' : 'Debug'}
      </button>

      {isOpen && (
        <div className="mt-1 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-lg min-w-[180px]">
          <div className="font-bold mb-2 border-b border-gray-700 pb-1">
            Debug Panel
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Coverage:</span>
              <span className={isComplete ? 'text-green-400' : 'text-yellow-400'}>
                {coveragePercent}%
              </span>
            </div>

            <div className="flex justify-between">
              <span>Threshold:</span>
              <span>{thresholdPercent}%</span>
            </div>

            <div className="flex justify-between">
              <span>Status:</span>
              <span className={isComplete ? 'text-green-400' : 'text-red-400'}>
                {isComplete ? '✓ Complete' : '✗ Incomplete'}
              </span>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <label className="block mb-1">
                Threshold: {thresholdPercent}%
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={thresholdPercent}
                onChange={(e) => onThresholdChange(Number(e.target.value) / 100)}
                className="w-full"
              />
            </div>

            <button
              onClick={() => onThresholdChange(DEFAULT_COMPLETION_THRESHOLD)}
              className="w-full mt-1 bg-gray-700 hover:bg-gray-600 py-1 rounded text-xs"
            >
              Reset ({Math.round(DEFAULT_COMPLETION_THRESHOLD * 100)}%)
            </button>

            {onTogglePoints && (
              <button
                onClick={onTogglePoints}
                className={`w-full mt-1 py-1 rounded text-xs ${showPoints ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                data-testid="debug-show-points"
              >
                {showPoints ? '● Hide Points' : '○ Show Points'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

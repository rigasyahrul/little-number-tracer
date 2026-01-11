import { useState, useEffect } from 'react'

export type MascotState = 'idle' | 'guiding' | 'happy' | 'sad' | 'celebrate'

interface MascotProps {
  state?: MascotState
}

export function Mascot({ state = 'idle' }: MascotProps) {
  const [displayState, setDisplayState] = useState<MascotState>(state)

  useEffect(() => {
    setDisplayState(state)

    // Auto-revert from guiding to idle
    if (state === 'guiding') {
      const timer = setTimeout(() => {
        setDisplayState('idle')
      }, 2000)
      return () => clearTimeout(timer)
    }

    // Auto-revert from happy to idle
    if (state === 'happy') {
      const timer = setTimeout(() => {
        setDisplayState('idle')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [state])

  const getEmoji = (): string => {
    switch (displayState) {
      case 'idle':
        return '😊'
      case 'guiding':
        return '👆'
      case 'happy':
        return '😄'
      case 'sad':
        return '😢'
      case 'celebrate':
        return '🎉'
      default:
        return '😊'
    }
  }

  const getAnimation = (): string => {
    switch (displayState) {
      case 'celebrate':
        return 'animate-bounce'
      case 'guiding':
        return 'animate-pulse'
      default:
        return ''
    }
  }

  return (
    <div
      className={`
        flex items-center justify-center
        w-32 h-32 bg-primary-yellow rounded-full
        shadow-lg border-4 border-primary-green
        text-6xl ${getAnimation()}
      `}
    >
      {getEmoji()}
    </div>
  )
}

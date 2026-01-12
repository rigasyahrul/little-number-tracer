import { useState, useEffect } from 'react'

export type MascotState = 'idle' | 'guiding' | 'happy' | 'sad' | 'celebrate'

interface MascotProps {
  state?: MascotState
  size?: 'normal' | 'small'
}

export function Mascot({ state = 'idle', size = 'normal' }: MascotProps) {
  const [displayState, setDisplayState] = useState<MascotState>(state)

  useEffect(() => {
    // Sync displayState with prop and handle auto-revert for transient states
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayState((current) => (current !== state ? state : current))

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

  const sizeClasses = size === 'small' 
    ? 'w-12 h-12 text-2xl border-2' 
    : 'w-32 h-32 text-6xl border-4'

  return (
    <div
      className={`
        flex items-center justify-center
        ${sizeClasses} bg-primary-yellow rounded-full
        shadow-lg border-primary-green
        ${getAnimation()}
      `}
    >
      {getEmoji()}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { audioManager } from '../../audio/AudioManager'

interface CelebrationOverlayProps {
  show: boolean
  onClose?: () => void
  duration?: number
}

export function CelebrationOverlay({
  show,
  onClose,
  duration = 3000,
}: CelebrationOverlayProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      audioManager.playSuccess()

      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 cursor-pointer"
      onClick={() => {
        setIsVisible(false)
        onClose?.()
      }}
    >
      {/* Confetti simulation with emojis */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Center celebration content */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-8xl animate-bounce">🎉</div>
          <h2 className="text-4xl font-bold text-text-dark">Great Job!</h2>
          <p className="text-xl text-text-dark">You did it! 🌟</p>
        </div>

        {/* Falling stars animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animation: `fall ${2 + Math.random() * 2}s linear forwards`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              ⭐
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

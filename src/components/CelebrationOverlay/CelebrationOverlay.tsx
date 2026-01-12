import { useState, useEffect } from 'react'
import { audioManager } from '../../audio/AudioManager'

interface CelebrationOverlayProps {
  show: boolean
  onClose?: () => void
  duration?: number
}

// Generate star positions outside component to avoid purity issues
const generateStars = () =>
  [...Array(12)].map((_, i) => ({
    left: Math.random() * 100,
    duration: 2 + Math.random() * 2,
    delay: i * 0.1,
  }))

const STARS = generateStars()

export function CelebrationOverlay({
  show,
  onClose,
  duration = 3000,
}: CelebrationOverlayProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    if (show) {
      // Sync visibility state and play celebration sound
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
          {STARS.map((star, i) => (
            <div
              key={i}
              className="absolute text-3xl animate-pulse"
              style={{
                left: `${star.left}%`,
                top: `-20px`,
                animation: `fall ${star.duration}s linear forwards`,
                animationDelay: `${star.delay}s`,
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

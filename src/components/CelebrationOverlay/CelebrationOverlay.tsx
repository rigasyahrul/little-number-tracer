import { useState } from 'react'
import { audioManager } from '../../audio/AudioManager'

interface CelebrationOverlayProps {
  show: boolean
  onTryAgain?: () => void
  onNextNumber?: () => void
  onBackToHome?: () => void
}

const generateStars = () =>
  [...Array(12)].map((_, i) => ({
    left: Math.random() * 100,
    duration: 2 + Math.random() * 2,
    delay: i * 0.1,
  }))

const STARS = generateStars()

export function CelebrationOverlay({
  show,
  onTryAgain,
  onNextNumber,
  onBackToHome,
}: CelebrationOverlayProps) {
  const [isVisible, setIsVisible] = useState(show)

  if (show && !isVisible) {
    setIsVisible(true)
    audioManager.playSuccess()
  }

  if (!show && isVisible) {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
      data-testid="celebration-overlay"
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-6 bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-md">
          <div className="text-6xl animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-text-dark">Great Job!</h2>
          <p className="text-lg text-text-dark">You did it! 🌟</p>

          <div className="flex flex-col gap-3 w-full mt-4">
            <button
              onClick={() => {
                onTryAgain?.()
                setIsVisible(false)
              }}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-primary-green text-text-light rounded-xl font-bold hover:opacity-90 text-lg"
              data-testid="try-again-button"
            >
              <span className="text-2xl">🔄</span>
              <span>Try Again</span>
            </button>

            <button
              onClick={() => {
                onNextNumber?.()
                setIsVisible(false)
              }}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-primary-yellow text-text-dark rounded-xl font-bold hover:opacity-90 text-lg"
              data-testid="next-number-button"
            >
              <span className="text-2xl">➡️</span>
              <span>Next Number</span>
            </button>

            <button
              onClick={() => {
                onBackToHome?.()
                setIsVisible(false)
              }}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-text-light text-text-dark rounded-xl font-bold hover:bg-gray-100 text-lg"
              data-testid="back-home-button"
            >
              <span className="text-2xl">🏠</span>
              <span>Back to Home</span>
            </button>
          </div>
        </div>

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

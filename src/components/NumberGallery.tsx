import { useProgressStore } from '../stores/progressStore'

interface NumberGalleryProps {
  onSelectNumber: (num: number) => void
  onOpenFreeDraw: () => void
}

export function NumberGallery({
  onSelectNumber,
  onOpenFreeDraw,
}: NumberGalleryProps) {
  const { numbers } = useProgressStore()

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-8 text-text-dark">
        Choose a Number to Learn
      </h2>

      {/* Number Grid */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const progress = numbers[num]
          const isCompleted = progress?.completed

          return (
            <button
              key={num}
              onClick={() => onSelectNumber(num)}
              className={`
                w-20 h-20 rounded-xl font-bold text-4xl
                transition-all duration-200 transform hover:scale-110
                shadow-lg border-2
                ${
                  isCompleted
                    ? 'bg-primary-green border-primary-green text-text-light'
                    : 'bg-primary-yellow border-primary-yellow text-text-dark'
                }
              `}
            >
              {num}
              {isCompleted && <span className="text-xl"> ✓</span>}
            </button>
          )
        })}
      </div>

      {/* Free Draw Button */}
      <button
        onClick={onOpenFreeDraw}
        className="px-6 py-3 bg-primary-blue text-text-light rounded-xl font-bold text-lg hover:opacity-90 transition-all"
      >
        Free Draw Mode
      </button>
    </div>
  )
}

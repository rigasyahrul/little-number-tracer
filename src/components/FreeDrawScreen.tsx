interface FreeDrawScreenProps {
  onClose: () => void
}

export function FreeDrawScreen({ onClose }: FreeDrawScreenProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-8 text-text-dark">
        Free Draw Mode
      </h2>
      <div className="text-6xl mb-8">Free Draw Canvas Coming</div>
      <button
        onClick={onClose}
        className="px-6 py-3 bg-secondary-pink text-text-light rounded-xl font-bold"
      >
        Back
      </button>
    </div>
  )
}

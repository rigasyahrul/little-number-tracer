interface TracingScreenProps {
  number: number
  onComplete: () => void
}

export function TracingScreen({ number, onComplete }: TracingScreenProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-8 text-text-dark">
        Trace the Number {number}
      </h2>
      <div className="text-6xl mb-8">Canvas Component Coming</div>
      <button
        onClick={onComplete}
        className="px-6 py-3 bg-primary-green text-text-light rounded-xl font-bold"
      >
        Done
      </button>
    </div>
  )
}

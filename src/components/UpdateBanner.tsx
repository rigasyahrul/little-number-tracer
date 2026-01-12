interface UpdateBannerProps {
  onReload?: () => void
}

export function UpdateBanner({ onReload }: UpdateBannerProps) {
  const handleReload = () => {
    onReload?.()
    window.location.reload()
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary-yellow border-t-4 border-primary-green shadow-lg z-50 animate-slide-up">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-bold text-text-dark">New version available!</p>
            <p className="text-sm text-text-dark opacity-80">
              Click reload to get the latest features
            </p>
          </div>
        </div>
        <button
          onClick={handleReload}
          className="px-6 py-2 bg-primary-green text-text-light rounded-lg font-bold hover:bg-green-600 transition-colors whitespace-nowrap"
        >
          Reload
        </button>
      </div>
    </div>
  )
}

interface UpdateBannerProps {
  onReload?: () => void
  onDismiss?: () => void
}

export function UpdateBanner({ onReload, onDismiss }: UpdateBannerProps) {
  const handleUpdate = async () => {
    onReload?.()
    // Unregister existing service workers and clear caches to force update
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(registrations.map((reg) => reg.unregister()))
    }
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map((name) => caches.delete(name)))
    }
    // Force hard reload bypassing all caches
    window.location.href = window.location.origin + '?update=' + Date.now()
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary-yellow border-t-4 border-primary-green shadow-lg z-50 animate-slide-up">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-bold text-text-dark">New version available!</p>
            <p className="text-sm text-text-dark opacity-80">
              Click update to get the latest features
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="px-4 py-2 text-text-dark opacity-70 hover:opacity-100 transition-opacity whitespace-nowrap"
              aria-label="Dismiss"
            >
              Later
            </button>
          )}
          <button
            onClick={handleUpdate}
            className="px-6 py-2 bg-primary-green text-text-light rounded-lg font-bold hover:bg-green-600 transition-colors whitespace-nowrap"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  )
}

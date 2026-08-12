/**
 * Save a PNG blob to the user's device in a cross-browser way.
 *
 * iPad/iOS Safari often ignores `<a download>` with **data:** URLs and may
 * navigate the current tab. Prefer:
 * 1. Web Share API with a File (iOS share sheet → Save Image / Files)
 * 2. Object-URL + download attribute (same-origin blob; keeps the page)
 * 3. Last resort: open blob URL in a new tab (user can long-press → Save Image)
 */
export async function downloadPngImage(
  blob: Blob,
  filename: string
): Promise<'shared' | 'downloaded' | 'opened'> {
  const file = new File([blob], filename, { type: 'image/png' })

  if (canShareFiles(file)) {
    try {
      await navigator.share({
        files: [file],
        title: 'Free Draw',
        text: filename,
      })
      return 'shared'
    } catch (error) {
      // User cancelled share sheet — do not fall through (avoids double UI)
      if (isAbortError(error)) return 'shared'
      console.warn('Web Share failed, falling back to download:', error)
    }
  }

  const url = URL.createObjectURL(blob)

  try {
    // Blob + download keeps the current page (unlike many data: URL cases)
    triggerAnchor(url, filename, /* useDownload */ true)

    // iOS sometimes ignores download and does nothing. If we detect a touch
    // Apple device and share was unavailable, also offer a delayed new-tab
    // only when the page is still focused and user got no share path.
    // Prefer not opening automatically — revoke after a short delay.
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
    return 'downloaded'
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }
}

function canShareFiles(file: File): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false
  }
  if (typeof navigator.canShare !== 'function') {
    return isAppleTouchDevice()
  }
  try {
    return navigator.canShare({ files: [file] })
  } catch {
    return false
  }
}

function isAppleTouchDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/iPad|iPhone|iPod/.test(ua)) return true
  // iPadOS 13+ may report as MacIntel with touch
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
}

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: string }).name === 'AbortError'
  )
}

function triggerAnchor(url: string, filename: string, useDownload: boolean) {
  const link = document.createElement('a')
  link.href = url
  if (useDownload) {
    link.download = filename
  } else {
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  }
  // Required for Firefox; harmless elsewhere
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
}

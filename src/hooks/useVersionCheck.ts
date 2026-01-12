import { useState, useEffect } from 'react'
import { APP_VERSION } from '../version'

interface VersionData {
  version: string
  timestamp: string
}

export function useVersionCheck() {
  const [hasUpdate, setHasUpdate] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Add cache-busting query parameter
        const response = await fetch(`/version.json?t=${Date.now()}`, {
          cache: 'no-store',
        })

        if (!response.ok) {
          console.warn('Failed to fetch version.json')
          return
        }

        const data: VersionData = await response.json()

        // Compare versions
        if (data.version !== APP_VERSION) {
          console.log(`Version mismatch: current=${APP_VERSION}, server=${data.version}`)
          setHasUpdate(true)
        }
      } catch (error) {
        console.warn('Version check failed:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkVersion()
  }, [])

  return {
    hasUpdate,
    isChecking,
  }
}

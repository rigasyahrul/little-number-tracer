import { create } from 'zustand'

export type AgeMode = '3-4' | '5'

const STORAGE_KEY = 'ageMode'
const DEFAULT_AGE_MODE: AgeMode = '3-4'

function loadAgeMode(): AgeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === '3-4' || stored === '5') return stored
  } catch {
    // localStorage not available
  }
  return DEFAULT_AGE_MODE
}

export interface AgeModeState {
  ageMode: AgeMode
  setAgeMode: (mode: AgeMode) => void
}

export const useAgeModeStore = create<AgeModeState>((set) => ({
  ageMode: loadAgeMode(),

  setAgeMode: (mode: AgeMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // localStorage not available
    }
    set({ ageMode: mode })
  },
}))

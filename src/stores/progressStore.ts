import { create } from 'zustand'
import { openDB } from 'idb'

const DB_NAME = 'NumberTracerDB'
const STORE_NAME = 'progress'

export interface NumberProgress {
  digit: number
  completed: boolean
  bestAccuracy?: number
  attempts: number
  lastCompletedAt?: string
}

export interface ProgressState {
  numbers: Record<number, NumberProgress>
  setCompleted: (digit: number, accuracy: number) => Promise<void>
  incrementAttempt: (digit: number) => Promise<void>
  getProgress: (digit: number) => NumberProgress | undefined
  hydrate: () => Promise<void>
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  numbers: {},

  setCompleted: async (digit: number, accuracy: number) => {
    const db = await openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'digit' })
        }
      },
    })

    const existing = await db.get(STORE_NAME, digit)
    const progress: NumberProgress = {
      digit,
      completed: true,
      bestAccuracy:
        existing && existing.bestAccuracy
          ? Math.max(existing.bestAccuracy, accuracy)
          : accuracy,
      attempts: (existing?.attempts || 0) + 1,
      lastCompletedAt: new Date().toISOString(),
    }

    await db.put(STORE_NAME, progress)

    set((state) => ({
      numbers: {
        ...state.numbers,
        [digit]: progress,
      },
    }))
  },

  incrementAttempt: async (digit: number) => {
    const db = await openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'digit' })
        }
      },
    })

    const existing = await db.get(STORE_NAME, digit)
    const progress: NumberProgress = existing || {
      digit,
      completed: false,
      attempts: 0,
    }
    progress.attempts = (progress.attempts || 0) + 1

    await db.put(STORE_NAME, progress)

    set((state) => ({
      numbers: {
        ...state.numbers,
        [digit]: progress,
      },
    }))
  },

  getProgress: (digit: number) => {
    const state = get()
    return state.numbers[digit]
  },

  hydrate: async () => {
    try {
      const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'digit' })
          }
        },
      })

      const allRecords = await db.getAll(STORE_NAME)
      const numbers: Record<number, NumberProgress> = {}

      allRecords.forEach((record) => {
        numbers[record.digit] = record
      })

      // Initialize missing digits
      for (let i = 0; i < 10; i++) {
        if (!numbers[i]) {
          numbers[i] = {
            digit: i,
            completed: false,
            attempts: 0,
          }
        }
      }

      set({ numbers })
    } catch (error) {
      console.error('Failed to hydrate progress store:', error)
      // Initialize with empty state
      const numbers: Record<number, NumberProgress> = {}
      for (let i = 0; i < 10; i++) {
        numbers[i] = {
          digit: i,
          completed: false,
          attempts: 0,
        }
      }
      set({ numbers })
    }
  },
}))

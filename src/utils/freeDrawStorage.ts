import { openDB, type IDBPDatabase } from 'idb'

const DB_NAME = 'NumberTracerFreeDrawDB'
const DB_VERSION = 1
const STORE_NAME = 'canvas'
const SNAPSHOT_KEY = 'current'

/** Public snapshot shape used by the free-draw screen. */
export interface FreeDrawSnapshot {
  blob: Blob
  /** CSS pixel width when saved */
  width: number
  /** CSS pixel height when saved */
  height: number
  updatedAt: string
}

/**
 * Stored record — WebKit/Safari rejects putting Blob/File into IDB
 * ("Error preparing Blob/File data to be stored in object store").
 * Persist PNG bytes as ArrayBuffer instead.
 */
interface StoredFreeDrawRecord {
  /** PNG bytes */
  data: ArrayBuffer
  mimeType: string
  width: number
  height: number
  updatedAt: string
}

let dbPromise: Promise<IDBPDatabase> | null = null

function openFreeDrawDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      },
    })
  }
  return dbPromise
}

async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  // Prefer arrayBuffer(); fallback for older engines
  if (typeof blob.arrayBuffer === 'function') {
    return blob.arrayBuffer()
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'))
    reader.readAsArrayBuffer(blob)
  })
}

/** Persist the current free-draw canvas snapshot. */
export async function saveFreeDrawSnapshot(
  snapshot: Omit<FreeDrawSnapshot, 'updatedAt'>
): Promise<void> {
  const db = await openFreeDrawDb()
  const data = await blobToArrayBuffer(snapshot.blob)
  const record: StoredFreeDrawRecord = {
    data,
    mimeType: snapshot.blob.type || 'image/png',
    width: snapshot.width,
    height: snapshot.height,
    updatedAt: new Date().toISOString(),
  }
  await db.put(STORE_NAME, record, SNAPSHOT_KEY)
}

/** Load the last free-draw snapshot, or null if none. */
export async function loadFreeDrawSnapshot(): Promise<FreeDrawSnapshot | null> {
  try {
    const db = await openFreeDrawDb()
    const record = (await db.get(STORE_NAME, SNAPSHOT_KEY)) as
      | StoredFreeDrawRecord
      | FreeDrawSnapshot
      | null
      | undefined
    if (!record) return null

    // New format: ArrayBuffer
    if ('data' in record && record.data) {
      const blob = new Blob([record.data], {
        type: record.mimeType || 'image/png',
      })
      return {
        blob,
        width: record.width,
        height: record.height,
        updatedAt: record.updatedAt,
      }
    }

    // Legacy format: Blob (Chromium may have written this)
    if ('blob' in record && record.blob instanceof Blob) {
      return record as FreeDrawSnapshot
    }

    return null
  } catch (error) {
    console.error('Failed to load free draw snapshot:', error)
    return null
  }
}

/** Remove the free-draw snapshot (e.g. after Clear All). */
export async function clearFreeDrawSnapshot(): Promise<void> {
  try {
    const db = await openFreeDrawDb()
    await db.delete(STORE_NAME, SNAPSHOT_KEY)
  } catch (error) {
    console.error('Failed to clear free draw snapshot:', error)
  }
}

/** Capture a canvas (bitmap pixels) as a PNG blob. */
export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Failed to encode canvas as PNG'))
      },
      'image/png'
    )
  })
}

/**
 * Draw a stored PNG blob onto a canvas, scaling to fit the current size.
 * Uses the canvas's current bitmap dimensions.
 */
export async function drawBlobToCanvas(
  canvas: HTMLCanvasElement,
  blob: Blob
): Promise<void> {
  const bitmap = await createImageBitmap(blob)
  try {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Reset any existing transform so we draw in device pixels
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  } finally {
    bitmap.close()
  }
}

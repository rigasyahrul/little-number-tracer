import { useState, useRef, useEffect, useCallback, forwardRef } from 'react'
import React from 'react'
import {
  saveFreeDrawSnapshot,
  loadFreeDrawSnapshot,
  clearFreeDrawSnapshot,
  canvasToPngBlob,
  drawBlobToCanvas,
} from '../utils/freeDrawStorage'
import { downloadPngImage } from '../utils/downloadImage'

interface FreeDrawScreenProps {
  onClose: () => void
}

interface ColorOption {
  name: string
  color: string
}

const COLORS: ColorOption[] = [
  { name: 'Black', color: '#1A1A2E' },
  { name: 'Red', color: '#E63946' },
  { name: 'Orange', color: '#FFB84D' },
  { name: 'Yellow', color: '#F4D35E' },
  { name: 'Green', color: '#52B788' },
  { name: 'Teal', color: '#4ECDC4' },
  { name: 'Blue', color: '#4A90D9' },
  { name: 'Purple', color: '#9B5DE5' },
  { name: 'Pink', color: '#FF6B9D' },
  { name: 'Brown', color: '#8B5A2B' },
]

export function FreeDrawScreen({ onClose: _onClose }: FreeDrawScreenProps) {
  void _onClose
  const [clearTrigger, setClearTrigger] = useState(0)
  const [selectedColor, setSelectedColor] = useState(COLORS[4].color)
  const [isEraser, setIsEraser] = useState(false)
  const [lineWidth, setLineWidth] = useState(5)
  const [menuOpen, setMenuOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 })
  const hasInkRef = useRef(false)
  const persistInFlightRef = useRef<Promise<void> | null>(null)

  useEffect(() => {
    const updateSize = () => {
      const padding = 0
      setCanvasSize({
        width: window.innerWidth - padding,
        height: window.innerHeight - 72 - padding,
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const persistCanvas = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas || canvas.width === 0 || canvas.height === 0) return
    const run = async () => {
      try {
        const blob = await canvasToPngBlob(canvas)
        const cssWidth = canvas.clientWidth || canvasSize.width
        const cssHeight = canvas.clientHeight || canvasSize.height
        await saveFreeDrawSnapshot({
          blob,
          width: cssWidth,
          height: cssHeight,
        })
        hasInkRef.current = true
      } catch (error) {
        console.error('Failed to persist free draw:', error)
      }
    }
    // Serialize writes so rapid strokes don't race
    const next = (persistInFlightRef.current ?? Promise.resolve()).then(run, run)
    persistInFlightRef.current = next
    await next
  }, [canvasSize.width, canvasSize.height])

  const handleStrokeEnd = useCallback(() => {
    hasInkRef.current = true
    void persistCanvas()
  }, [persistCanvas])

  // Soft guard on refresh/close — drawing is already in IndexedDB after each stroke
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasInkRef.current) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

  const handleClear = () => {
    setClearTrigger((prev) => prev + 1)
    hasInkRef.current = false
    void clearFreeDrawSnapshot()
    setMenuOpen(false)
  }

  const handleSave = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return

    tempCtx.fillStyle = '#FFFFFF'
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
    tempCtx.drawImage(canvas, 0, 0)

    try {
      const blob = await canvasToPngBlob(tempCanvas)
      const filename = `free-draw-${Date.now()}.png`
      const result = await downloadPngImage(blob, filename)
      if (result === 'shared') {
        setSaveStatus('Shared!')
      } else if (result === 'opened') {
        setSaveStatus('Long-press the image to save')
      } else {
        setSaveStatus('Saved!')
      }
      window.setTimeout(() => setSaveStatus(null), 2500)
    } catch (error) {
      console.error('Failed to save free draw image:', error)
      setSaveStatus('Save failed')
      window.setTimeout(() => setSaveStatus(null), 2500)
    }
    setMenuOpen(false)
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      {/* Canvas container - full screen */}
      <div className="w-full h-full relative bg-white">
        <FreeDrawCanvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          color={isEraser ? '#FFFFFF' : selectedColor}
          clearTrigger={clearTrigger}
          isEraser={isEraser}
          lineWidth={isEraser ? lineWidth * 3 : lineWidth}
          onStrokeEnd={handleStrokeEnd}
        />

        {/* Floating menu button on right */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="absolute right-4 top-4 w-14 h-14 rounded-full bg-primary-blue text-white shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform z-10"
          aria-label={menuOpen ? 'Close menu' : 'Open drawing menu'}
        >
          {menuOpen ? '✕' : '🎨'}
        </button>

        {/* Floating menu panel */}
        {menuOpen && (
          <div className="absolute right-4 top-20 bg-white rounded-2xl shadow-2xl p-4 z-20 w-72 border-2 border-primary-blue">
            {/* Color palette */}
            <div className="mb-4">
              <p className="text-sm font-bold text-text-dark mb-2">Colors</p>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((colorOpt) => (
                  <button
                    key={colorOpt.name}
                    onClick={() => {
                      setSelectedColor(colorOpt.color)
                      setIsEraser(false)
                    }}
                    className={`
                      w-10 h-10 rounded-full border-3 transition-all
                      ${
                        selectedColor === colorOpt.color && !isEraser
                          ? 'border-text-dark scale-110 ring-2 ring-primary-blue'
                          : 'border-gray-300'
                      }
                    `}
                    style={{ backgroundColor: colorOpt.color }}
                    title={colorOpt.name}
                  />
                ))}
              </div>
            </div>

            {/* Line thickness slider */}
            <div className="mb-4">
              <p className="text-sm font-bold text-text-dark mb-2">
                Thickness: {lineWidth}px
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: selectedColor }}
                />
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${selectedColor} 0%, ${selectedColor} ${((lineWidth - 1) / 14) * 100}%, #e5e7eb ${((lineWidth - 1) / 14) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
              {/* Preview of line thickness */}
              <div className="mt-2 flex justify-center">
                <div
                  className="rounded-full"
                  style={{
                    width: lineWidth,
                    height: lineWidth,
                    backgroundColor: isEraser ? '#ccc' : selectedColor,
                    minWidth: 4,
                    minHeight: 4,
                  }}
                />
              </div>
            </div>

            {/* Tools */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsEraser(!isEraser)}
                className={`
                  w-full px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                  ${
                    isEraser
                      ? 'bg-secondary-coral text-white'
                      : 'bg-gray-200 text-text-dark'
                  }
                `}
              >
                <span>🧽</span>
                {isEraser ? '✓ Eraser On' : 'Eraser'}
              </button>
              <button
                onClick={handleClear}
                className="w-full px-4 py-3 bg-secondary-pink text-white rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2"
              >
                <span>🗑️</span>
                Clear All
              </button>
              <button
                onClick={() => void handleSave()}
                className="w-full px-4 py-3 bg-primary-green text-white rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2"
              >
                <span>💾</span>
                Save Image
              </button>
            </div>
          </div>
        )}

        {/* Save status toast */}
        {saveStatus && (
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-20 bg-text-dark text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-30"
            role="status"
          >
            {saveStatus}
          </div>
        )}

        {/* Current tool indicator (bottom right) */}
        <div className="absolute right-4 bottom-4 flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 shadow-lg">
          <div
            className="rounded-full border-2 border-gray-400"
            style={{
              width: Math.max(lineWidth, 8),
              height: Math.max(lineWidth, 8),
              backgroundColor: isEraser ? '#f0f0f0' : selectedColor,
            }}
          />
          <span className="text-sm font-medium text-text-dark">
            {isEraser ? 'Eraser' : 'Pen'}
          </span>
        </div>
      </div>
    </div>
  )
}

interface FreeDrawCanvasProps {
  width?: number
  height?: number
  color?: string
  clearTrigger?: number
  isEraser?: boolean
  lineWidth?: number
  onStrokeEnd?: () => void
}

const FreeDrawCanvas = forwardRef<HTMLCanvasElement, FreeDrawCanvasProps>(
  (
    {
      width = 800,
      height = 600,
      color = '#52B788',
      clearTrigger = 0,
      isEraser = false,
      lineWidth = 5,
      onStrokeEnd,
    },
    ref
  ) => {
    const internalCanvasRef = React.useRef<HTMLCanvasElement>(null)
    const canvasRef =
      (ref as React.RefObject<HTMLCanvasElement | null>) || internalCanvasRef
    const contextRef = React.useRef<CanvasRenderingContext2D | null>(null)
    // Ref (not state) so pointermove in the same frame as pointerdown still draws
    const isDrawingRef = React.useRef(false)
    const isInitializedRef = React.useRef(false)
    const restoreDoneRef = React.useRef(false)
    const lineWidthRef = React.useRef(lineWidth)
    const onStrokeEndRef = React.useRef(onStrokeEnd)
    const dprRef = React.useRef(1)

    React.useEffect(() => {
      onStrokeEndRef.current = onStrokeEnd
    }, [onStrokeEnd])

    // Keep lineWidth ref updated
    React.useEffect(() => {
      lineWidthRef.current = lineWidth
    }, [lineWidth])

    const applyContextDefaults = (context: CanvasRenderingContext2D) => {
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.lineWidth = lineWidthRef.current
    }

    // Initialize canvas (only on size changes) + restore snapshot once
    React.useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      let cancelled = false

      const setup = async () => {
        const dpr = window.devicePixelRatio || 1
        dprRef.current = dpr
        const context = canvas.getContext('2d')
        if (!context) return

        // Preserve current pixels across resize via offscreen copy
        let previousBitmap: ImageBitmap | null = null
        if (isInitializedRef.current && canvas.width > 0 && canvas.height > 0) {
          try {
            previousBitmap = await createImageBitmap(canvas)
          } catch {
            previousBitmap = null
          }
        }

        if (cancelled) {
          previousBitmap?.close()
          return
        }

        canvas.width = width * dpr
        canvas.height = height * dpr
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'

        context.setTransform(1, 0, 0, 1, 0, 0)
        context.scale(dpr, dpr)
        applyContextDefaults(context)

        if (previousBitmap) {
          context.drawImage(previousBitmap, 0, 0, width, height)
          previousBitmap.close()
        } else if (!restoreDoneRef.current) {
          // First mount: restore from IndexedDB if present
          const snapshot = await loadFreeDrawSnapshot()
          if (cancelled) return
          if (snapshot?.blob) {
            // drawBlobToCanvas draws in device pixels; temporarily reset transform
            await drawBlobToCanvas(canvas, snapshot.blob)
            if (cancelled) return
            // Re-apply CSS-pixel scale for drawing
            context.setTransform(1, 0, 0, 1, 0, 0)
            context.scale(dpr, dpr)
            applyContextDefaults(context)
          }
          restoreDoneRef.current = true
        }

        contextRef.current = context
        isInitializedRef.current = true
      }

      void setup()

      return () => {
        cancelled = true
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height])

    // Handle clear
    React.useEffect(() => {
      if (clearTrigger > 0) {
        const context = contextRef.current
        const canvas = canvasRef.current
        if (context && canvas) {
          context.save()
          context.setTransform(1, 0, 0, 1, 0, 0)
          context.clearRect(0, 0, canvas.width, canvas.height)
          context.restore()
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clearTrigger])

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      const canvas = canvasRef.current
      if (canvas) {
        try {
          canvas.setPointerCapture(e.pointerId)
        } catch {
          /* ignore */
        }
      }
      const { x, y } = getPointerCoordinates(e)

      const context = contextRef.current
      if (context) {
        context.lineWidth = lineWidth
        context.strokeStyle = isEraser ? '#FFF' : color
        context.globalCompositeOperation = isEraser
          ? 'destination-out'
          : 'source-over'
        context.beginPath()
        context.moveTo(x, y)
      }

      isDrawingRef.current = true
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return
      e.preventDefault()

      const { x, y } = getPointerCoordinates(e)

      const context = contextRef.current
      if (context) {
        context.lineTo(x, y)
        context.stroke()
      }
    }

    const endStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return
      e.preventDefault()

      isDrawingRef.current = false

      const context = contextRef.current
      if (context) {
        context.globalCompositeOperation = 'source-over'
        context.closePath()
      }

      onStrokeEndRef.current?.()
    }

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      endStroke(e)
    }

    const handlePointerCancel = (e: React.PointerEvent<HTMLCanvasElement>) => {
      endStroke(e)
    }

    const getPointerCoordinates = (
      e: React.PointerEvent<HTMLCanvasElement>
    ): { x: number; y: number } => {
      const canvas = canvasRef.current
      if (!canvas) return { x: 0, y: 0 }

      const rect = canvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    return (
      <canvas
        ref={canvasRef}
        data-testid="free-draw-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerUp}
        style={{
          border: 'none',
          cursor: isEraser
            ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23333\' stroke-width=\'2\'%3E%3Cpath d=\'M20 20H7L3 16c-.6-.6-.6-1.5 0-2.1l10-10c.6-.6 1.5-.6 2.1 0l6 6c.6.6.6 1.5 0 2.1L13 20\'/%3E%3Cpath d=\'M6 11l4 4\'/%3E%3C/svg%3E") 12 12, crosshair'
            : 'crosshair',
          backgroundColor: '#fff',
          touchAction: 'none',
        }}
      />
    )
  }
)

FreeDrawCanvas.displayName = 'FreeDrawCanvas'

import { useState, useRef, useEffect } from 'react'
import React from 'react'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 })

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

  const handleClear = () => {
    setClearTrigger((prev) => prev + 1)
    setMenuOpen(false)
  }

  const handleSave = () => {
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

    const link = document.createElement('a')
    link.download = `free-draw-${Date.now()}.png`
    link.href = tempCanvas.toDataURL('image/png')
    link.click()
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
        />

        {/* Floating menu button on right */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="absolute right-4 top-4 w-14 h-14 rounded-full bg-primary-blue text-white shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform z-10"
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
                onClick={handleSave}
                className="w-full px-4 py-3 bg-primary-green text-white rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2"
              >
                <span>💾</span>
                Save Image
              </button>
            </div>
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
}

const FreeDrawCanvas = React.forwardRef<HTMLCanvasElement, FreeDrawCanvasProps>(
  (
    {
      width = 800,
      height = 600,
      color = '#52B788',
      clearTrigger = 0,
      isEraser = false,
      lineWidth = 5,
    },
    ref
  ) => {
    const internalCanvasRef = React.useRef<HTMLCanvasElement>(null)
    const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) || internalCanvasRef
    const contextRef = React.useRef<CanvasRenderingContext2D | null>(null)
    const [isDrawing, setIsDrawing] = React.useState(false)
    const isInitializedRef = React.useRef(false)
    const imageDataRef = React.useRef<ImageData | null>(null)
    const lineWidthRef = React.useRef(lineWidth)

  // Keep lineWidth ref updated
  React.useEffect(() => {
    lineWidthRef.current = lineWidth
  }, [lineWidth])

  // Initialize canvas (only on size changes)
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const context = canvas.getContext('2d')

    // Save current drawing before resize
    if (isInitializedRef.current && context) {
      imageDataRef.current = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      )
    }

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    if (!context) return

    context.scale(dpr, dpr)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = lineWidthRef.current

    // Restore drawing after resize (best effort)
    if (imageDataRef.current) {
      context.putImageData(imageDataRef.current, 0, 0)
    }

    contextRef.current = context
    isInitializedRef.current = true
  }, [width, height])

  // Handle clear
  React.useEffect(() => {
    if (clearTrigger > 0) {
      const context = contextRef.current
      if (context) {
        context.clearRect(0, 0, width, height)
      }
    }
  }, [clearTrigger, width, height])

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
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

    setIsDrawing(true)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()

    const { x, y } = getPointerCoordinates(e)

    const context = contextRef.current
    if (context) {
      context.lineTo(x, y)
      context.stroke()
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()

    setIsDrawing(false)

    const context = contextRef.current
    if (context) {
      context.globalCompositeOperation = 'source-over'
      context.closePath()
    }
  }

  const handlePointerCancel = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()

    setIsDrawing(false)
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
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

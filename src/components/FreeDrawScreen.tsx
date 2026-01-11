import { useState } from 'react'
import React from 'react'

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600

interface FreeDrawScreenProps {
  onClose: () => void
}

interface ColorOption {
  name: string
  color: string
}

const COLORS: ColorOption[] = [
  { name: 'Green', color: '#52B788' },
  { name: 'Yellow', color: '#F4D35E' },
  { name: 'Orange', color: '#FFB84D' },
  { name: 'Blue', color: '#4ECDC4' },
  { name: 'Pink', color: '#FF6B9D' },
]

export function FreeDrawScreen({ onClose }: FreeDrawScreenProps) {
  const [clearTrigger, setClearTrigger] = useState(0)
  const [selectedColor, setSelectedColor] = useState(COLORS[0].color)
  const [isEraser, setIsEraser] = useState(false)

  const handleClear = () => {
    setClearTrigger((prev) => prev + 1)
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold text-text-dark">Free Draw Mode</h2>

      {/* Canvas container */}
      <div
        className="relative bg-white border-4 border-primary-blue rounded-lg shadow-lg"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        <FreeDrawCanvas
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          color={isEraser ? '#FFFFFF' : selectedColor}
          clearTrigger={clearTrigger}
          isEraser={isEraser}
        />
      </div>

      {/* Color palette */}
      <div className="flex gap-3">
        {COLORS.map((colorOpt) => (
          <button
            key={colorOpt.name}
            onClick={() => {
              setSelectedColor(colorOpt.color)
              setIsEraser(false)
            }}
            className={`
              w-12 h-12 rounded-full border-4 transition-all
              ${
                selectedColor === colorOpt.color && !isEraser
                  ? 'border-text-dark scale-110'
                  : 'border-gray-300'
              }
            `}
            style={{ backgroundColor: colorOpt.color }}
            title={colorOpt.name}
          />
        ))}
      </div>

      {/* Tools */}
      <div className="flex gap-4">
        <button
          onClick={() => setIsEraser(!isEraser)}
          className={`
            px-6 py-3 rounded-xl font-bold transition-all
            ${
              isEraser
                ? 'bg-secondary-coral text-text-light'
                : 'bg-gray-300 text-text-dark'
            }
          `}
        >
          {isEraser ? '✓ Eraser' : 'Eraser'}
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-3 bg-secondary-pink text-text-light rounded-xl font-bold hover:opacity-90"
        >
          Clear All
        </button>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-primary-green text-text-light rounded-xl font-bold hover:opacity-90"
        >
          Done
        </button>
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
}

function FreeDrawCanvas({
  width = 800,
  height = 600,
  color = '#52B788',
  clearTrigger = 0,
  isEraser = false,
}: FreeDrawCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const contextRef = React.useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = React.useState(false)

  // Initialize canvas
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    const context = canvas.getContext('2d')
    if (!context) return

    context.scale(dpr, dpr)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = isEraser ? 15 : 5

    contextRef.current = context
  }, [width, height, color, isEraser])

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
        borderRadius: '6px',
        cursor: isEraser ? 'cell' : 'crosshair',
        backgroundColor: '#fff',
        touchAction: 'none',
      }}
    />
  )
}

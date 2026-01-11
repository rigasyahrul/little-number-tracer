import { useRef, useEffect, useState } from 'react'

interface Point {
  x: number
  y: number
  t: number
}

interface TracingCanvasProps {
  width?: number
  height?: number
  onStrokeChange?: (points: Point[]) => void
  onStrokeEnd?: (points: Point[]) => void
  clearTrigger?: number
}

export function TracingCanvas({
  width = 800,
  height = 600,
  onStrokeChange,
  onStrokeEnd,
  clearTrigger = 0,
}: TracingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentStroke, setCurrentStroke] = useState<Point[]>([])

  // Initialize canvas
  useEffect(() => {
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
    context.lineWidth = 15
    context.strokeStyle = '#52B788'

    contextRef.current = context
  }, [width, height])

  // Handle clear
  useEffect(() => {
    if (clearTrigger > 0) {
      const context = contextRef.current
      if (context) {
        context.clearRect(0, 0, width, height)
        setCurrentStroke([])
      }
    }
  }, [clearTrigger, width, height])

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const { x, y } = getPointerCoordinates(e)
    const newStroke: Point[] = [{ x, y, t: Date.now() }]
    setCurrentStroke(newStroke)
    setIsDrawing(true)

    const context = contextRef.current
    if (context) {
      context.beginPath()
      context.moveTo(x, y)
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()

    const { x, y } = getPointerCoordinates(e)
    const newPoint = { x, y, t: Date.now() }
    const newStroke = [...currentStroke, newPoint]
    setCurrentStroke(newStroke)

    const context = contextRef.current
    if (context) {
      context.lineTo(x, y)
      context.stroke()
    }

    onStrokeChange?.(newStroke)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()

    setIsDrawing(false)
    onStrokeEnd?.(currentStroke)
  }

  const handlePointerCancel = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()

    setIsDrawing(false)
    onStrokeEnd?.(currentStroke)
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
        position: 'relative',
        zIndex: 10,
        border: '2px solid #999',
        borderRadius: '8px',
        cursor: 'crosshair',
        backgroundColor: 'transparent',
        touchAction: 'none',
      }}
    />
  )
}

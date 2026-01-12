import { useRef, useEffect, useState, useCallback } from 'react'

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
  // currentStroke is managed via functional updates in event handlers
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_currentStroke, setCurrentStroke] = useState<Point[]>([])

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

  // Handle clear - syncs canvas clearing with external trigger
  useEffect(() => {
    if (clearTrigger > 0) {
      const context = contextRef.current
      if (context) {
        context.clearRect(0, 0, width, height)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentStroke([])
      }
    }
  }, [clearTrigger, width, height])

  const getPointerCoordinates = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } => {
      const canvas = canvasRef.current
      if (!canvas) return { x: 0, y: 0 }

      const rect = canvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    },
    []
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      const { x, y } = getPointerCoordinates(e)
      const timestamp = Date.now()
      const newStroke: Point[] = [{ x, y, t: timestamp }]
      setCurrentStroke(newStroke)
      setIsDrawing(true)

      const context = contextRef.current
      if (context) {
        context.beginPath()
        context.moveTo(x, y)
      }
    },
    [getPointerCoordinates]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return
      e.preventDefault()

      const { x, y } = getPointerCoordinates(e)
      const timestamp = Date.now()
      const newPoint = { x, y, t: timestamp }
      setCurrentStroke((prevStroke) => {
        const newStroke = [...prevStroke, newPoint]

        const context = contextRef.current
        if (context) {
          context.lineTo(x, y)
          context.stroke()
        }

        onStrokeChange?.(newStroke)
        return newStroke
      })
    },
    [isDrawing, getPointerCoordinates, onStrokeChange]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return
      e.preventDefault()

      setIsDrawing(false)
      setCurrentStroke((prevStroke) => {
        onStrokeEnd?.(prevStroke)
        return prevStroke
      })
    },
    [isDrawing, onStrokeEnd]
  )

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return
      e.preventDefault()

      setIsDrawing(false)
      setCurrentStroke((prevStroke) => {
        onStrokeEnd?.(prevStroke)
        return prevStroke
      })
    },
    [isDrawing, onStrokeEnd]
  )

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

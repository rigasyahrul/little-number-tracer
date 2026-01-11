import { useEffect, useRef } from 'react'
import type { NumberDefinition } from '../../types/tracing'

interface NumberPathProps {
  numberDef: NumberDefinition
  width?: number
  height?: number
  highlightStrokeId?: string
  onPathStrokeId?: string
}

export function NumberPath({
  numberDef,
  width = 800,
  height = 600,
  highlightStrokeId,
  onPathStrokeId,
}: NumberPathProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    context.clearRect(0, 0, width, height)

    // Draw dotted paths for each stroke
    numberDef.strokes.forEach((stroke) => {
      const isHighlighted = stroke.id === highlightStrokeId
      const isOnPath = stroke.id === onPathStrokeId

      if (isOnPath) {
        context.strokeStyle = '#52B788' // tracing.active
      } else if (isHighlighted) {
        context.strokeStyle = '#FFB84D' // primary.orange
      } else {
        context.strokeStyle = '#999999' // tracing.dotted
      }

      context.setLineDash(isHighlighted ? [] : [5, 5])
      context.lineWidth = isHighlighted ? 4 : 3
      context.lineCap = 'round'
      context.lineJoin = 'round'

      if (isOnPath) {
        context.shadowColor = 'rgba(82, 183, 136, 0.5)'
        context.shadowBlur = 8
      } else {
        context.shadowColor = 'transparent'
      }

      context.beginPath()
      const firstPoint = stroke.points[0]
      context.moveTo(firstPoint.x * width, firstPoint.y * height)

      stroke.points.forEach((point) => {
        context.lineTo(point.x * width, point.y * height)
      })
      context.stroke()
      context.shadowColor = 'transparent'
    })

    // Draw start point marker
    const startPoint = numberDef.startPoint
    context.setLineDash([])
    context.fillStyle = '#FFFFFF'
    context.strokeStyle = '#F4D35E'
    context.lineWidth = 3
    context.beginPath()
    context.arc(startPoint.x * width, startPoint.y * height, 12, 0, Math.PI * 2)
    context.fill()
    context.stroke()

    // Draw start label
    context.fillStyle = '#F4D35E'
    context.font = 'bold 14px sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText('START', startPoint.x * width, startPoint.y * height)
  }, [numberDef, width, height, highlightStrokeId, onPathStrokeId])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

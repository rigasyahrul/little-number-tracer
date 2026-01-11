import { useEffect, useRef } from 'react'
import type { Stroke } from '../../types/tracing'

interface StrokeArrowsProps {
  stroke: Stroke | undefined
  width?: number
  height?: number
  isCurrentStroke?: boolean
}

export function StrokeArrows({
  stroke,
  width = 800,
  height = 600,
  isCurrentStroke = true,
}: StrokeArrowsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isCurrentStroke || !stroke || !stroke.points || stroke.points.length < 2) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    const context = canvas.getContext('2d')
    if (!context) return

    context.scale(dpr, dpr)

    const animate = () => {
      context.clearRect(0, 0, width, height)

      // Draw arrows at intervals along path
      const spacing = Math.max(5, stroke.points.length / 4)
      timeRef.current = (timeRef.current + 0.02) % 1

      for (let i = 0; i < stroke.points.length - 1; i += spacing) {
        const point = stroke.points[i]
        const nextPoint = stroke.points[Math.min(i + 1, stroke.points.length - 1)]

        const x = point.x * width
        const y = point.y * height
        const nextX = nextPoint.x * width
        const nextY = nextPoint.y * height

        const dx = nextX - x
        const dy = nextY - y
        const angle = Math.atan2(dy, dx)

        // Pulsing opacity
        const pulse = 0.5 + 0.5 * Math.sin(timeRef.current * Math.PI * 2 + (i / spacing) * 0.5)
        context.globalAlpha = pulse

        // Draw arrow
        drawArrow(context, x, y, angle, 16)
      }

      context.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [stroke, width, height, isCurrentStroke])

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

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  size: number
) {
  const headlen = size
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  ctx.fillStyle = '#52B788'
  ctx.strokeStyle = '#52B788'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Arrow shaft
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + cos * headlen, y + sin * headlen)
  ctx.stroke()

  // Arrow head
  const headAngle1 = angle - Math.PI / 6
  const headAngle2 = angle + Math.PI / 6

  ctx.beginPath()
  ctx.moveTo(x + cos * headlen, y + sin * headlen)
  ctx.lineTo(
    x + Math.cos(headAngle1) * (headlen * 0.6),
    y + Math.sin(headAngle1) * (headlen * 0.6)
  )
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x + cos * headlen, y + sin * headlen)
  ctx.lineTo(
    x + Math.cos(headAngle2) * (headlen * 0.6),
    y + Math.sin(headAngle2) * (headlen * 0.6)
  )
  ctx.stroke()
}

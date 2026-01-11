import { useMemo } from 'react'
import type { NumberDefinition } from '../../types/tracing'

interface NumberPathProps {
  numberDef: NumberDefinition
  width?: number
  height?: number
  highlightStrokeId?: string
  onPathStrokeId?: string
}

function scaleSvgPath(path: string, width: number, height: number): string {
  const tokens = path.match(/[MLCQASZHV]|[+-]?\d*\.?\d+/gi) || []
  const result: string[] = []
  let isXCoord = true
  
  for (const token of tokens) {
    if (/^[MLCQASZHV]$/i.test(token)) {
      result.push(token)
      if (token.toUpperCase() === 'H') {
        isXCoord = true
      } else if (token.toUpperCase() === 'V') {
        isXCoord = false
      } else {
        isXCoord = true
      }
    } else {
      const value = parseFloat(token)
      if (!isNaN(value)) {
        if (isXCoord) {
          result.push(String((value / 100) * width))
        } else {
          result.push(String((value / 100) * height))
        }
        isXCoord = !isXCoord
      }
    }
  }
  
  return result.join(' ')
}

export function NumberPath({
  numberDef,
  width = 800,
  height = 600,
  highlightStrokeId,
  onPathStrokeId,
}: NumberPathProps) {
  const scaledPaths = useMemo(() => {
    const backgroundPath = scaleSvgPath(numberDef.svgPath, width, height)
    const strokePaths = numberDef.strokes.map((stroke) => ({
      id: stroke.id,
      path: scaleSvgPath(stroke.svgPath, width, height),
    }))
    return { backgroundPath, strokePaths }
  }, [numberDef, width, height])

  const startX = numberDef.startPoint.x * width
  const startY = numberDef.startPoint.y * height

  return (
    <svg
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {/* Thick gray background number */}
      <path
        d={scaledPaths.backgroundPath}
        fill="none"
        stroke="#CCCCCC"
        strokeWidth={24}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dotted guide paths for each stroke */}
      {scaledPaths.strokePaths.map((strokePath) => {
        const isHighlighted = strokePath.id === highlightStrokeId
        const isOnPath = strokePath.id === onPathStrokeId

        let strokeColor = '#666666'
        let strokeWidth = 3
        let dashArray = '8,8'
        let filter = ''

        if (isOnPath) {
          strokeColor = '#52B788'
          strokeWidth = 4
          dashArray = ''
          filter = 'url(#glowFilter)'
        } else if (isHighlighted) {
          strokeColor = '#FFB84D'
          strokeWidth = 4
          dashArray = ''
        }

        return (
          <path
            key={strokePath.id}
            d={strokePath.path}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={dashArray}
            filter={filter}
          />
        )
      })}

      {/* Glow filter for active path */}
      <defs>
        <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Start point marker */}
      <circle
        cx={startX}
        cy={startY}
        r={14}
        fill="#FFFFFF"
        stroke="#F4D35E"
        strokeWidth={3}
      />
      <text
        x={startX}
        y={startY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#F4D35E"
        fontSize="11"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        START
      </text>
    </svg>
  )
}

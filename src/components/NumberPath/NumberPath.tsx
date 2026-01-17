import type { NumberDefinition } from '../../types/tracing'

interface NumberPathProps {
  numberDef: NumberDefinition
  width?: number
  height?: number
  highlightStrokeId?: string
  onPathStrokeId?: string
  showDebugPoints?: boolean
}

export function NumberPath({
  numberDef,
  width = 800,
  height = 600,
  highlightStrokeId,
  onPathStrokeId,
  showDebugPoints = false,
}: NumberPathProps) {
  const startX = numberDef.startPoint.x * 100
  const startY = numberDef.startPoint.y * 100

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
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
        d={numberDef.svgPath}
        fill="none"
        stroke="#CCCCCC"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dotted guide paths for each stroke */}
      {numberDef.strokes.map((stroke) => {
        const isHighlighted = stroke.id === highlightStrokeId
        const isOnPath = stroke.id === onPathStrokeId

        let strokeColor = '#FF9500'
        let strokeWidthVal = 0.5
        let dashArray = '1,2'
        let filter = ''

        if (isOnPath) {
          strokeColor = '#34C759'
          strokeWidthVal = 0.6
          dashArray = '1,2'
          filter = 'url(#glowFilter)'
        } else if (isHighlighted) {
          strokeColor = '#FF9500'
          strokeWidthVal = 0.6
          dashArray = '1,2'
        }

        return (
          <path
            key={stroke.id}
            d={stroke.svgPath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidthVal}
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
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
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
        r={1.75}
        fill="#FFFFFF"
        stroke="#F4D35E"
        strokeWidth={0.4}
      />
      <text
        x={startX}
        y={startY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#F4D35E"
        fontSize="1.4"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        START
      </text>

      {/* Debug points - show detection points */}
      {showDebugPoints && numberDef.strokes.map((stroke) =>
        stroke.points.map((point, idx) => (
          <g key={`${stroke.id}-point-${idx}`}>
            <circle
              cx={point.x * 100}
              cy={point.y * 100}
              r={1}
              fill="rgba(255, 0, 0, 0.5)"
              stroke="#FF0000"
              strokeWidth={0.25}
            />
            <text
              x={point.x * 100}
              y={point.y * 100}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#FFFFFF"
              fontSize="1"
              fontWeight="bold"
            >
              {idx + 1}
            </text>
          </g>
        ))
      )}
    </svg>
  )
}

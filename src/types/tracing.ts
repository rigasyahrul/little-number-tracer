export interface StrokePoint {
  x: number
  y: number
}

export interface Stroke {
  id: string
  points: StrokePoint[]
  svgPath: string // SVG path data with curves (in normalized 0-100 space)
}

export interface NumberDefinition {
  digit: number
  strokes: Stroke[]
  startPoint: StrokePoint
  svgPath: string // Complete SVG path for the entire number (for background rendering)
}

export interface UserStroke {
  points: Array<{
    x: number
    y: number
    t: number // timestamp
  }>
}

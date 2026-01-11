export interface StrokePoint {
  x: number
  y: number
}

export interface Stroke {
  id: string
  points: StrokePoint[]
}

export interface NumberDefinition {
  digit: number
  strokes: Stroke[]
  startPoint: StrokePoint
}

export interface UserStroke {
  points: Array<{
    x: number
    y: number
    t: number // timestamp
  }>
}

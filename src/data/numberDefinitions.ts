import type { NumberDefinition } from '../types/tracing'

/**
 * Number definitions with SVG path data using Bezier curves for smooth rendering.
 * 
 * SVG paths are defined in a normalized 0-100 coordinate space.
 * Points are still provided for tracing detection (normalized 0-1 space).
 * 
 * Each number has:
 * - svgPath: Complete path for rendering the thick background number
 * - strokes: Individual strokes with their own svgPath and detection points
 */

export const numberDefinitions: Record<number, NumberDefinition> = {
  0: {
    digit: 0,
    startPoint: { x: 0.5, y: 0.15 },
    svgPath: 'M 50,15 C 75,15 85,35 85,50 C 85,65 75,85 50,85 C 25,85 15,65 15,50 C 15,35 25,15 50,15 Z',
    strokes: [
      {
        id: '0-1',
        svgPath: 'M 50,15 C 75,15 85,35 85,50 C 85,65 75,85 50,85 C 25,85 15,65 15,50 C 15,35 25,15 50,15 Z',
        points: [
          { x: 0.5, y: 0.15 },
          { x: 0.65, y: 0.18 },
          { x: 0.78, y: 0.28 },
          { x: 0.85, y: 0.42 },
          { x: 0.85, y: 0.58 },
          { x: 0.78, y: 0.72 },
          { x: 0.65, y: 0.82 },
          { x: 0.5, y: 0.85 },
          { x: 0.35, y: 0.82 },
          { x: 0.22, y: 0.72 },
          { x: 0.15, y: 0.58 },
          { x: 0.15, y: 0.42 },
          { x: 0.22, y: 0.28 },
          { x: 0.35, y: 0.18 },
          { x: 0.5, y: 0.15 },
        ],
      },
    ],
  },
  1: {
    digit: 1,
    startPoint: { x: 0.35, y: 0.25 },
    svgPath: 'M 35,25 L 50,15 L 50,85',
    strokes: [
      {
        id: '1-1',
        svgPath: 'M 35,25 L 50,15 L 50,85',
        points: [
          { x: 0.35, y: 0.25 },
          { x: 0.5, y: 0.15 },
          { x: 0.5, y: 0.35 },
          { x: 0.5, y: 0.5 },
          { x: 0.5, y: 0.65 },
          { x: 0.5, y: 0.85 },
        ],
      },
    ],
  },
  2: {
    digit: 2,
    startPoint: { x: 0.2, y: 0.3 },
    svgPath: 'M 20,30 C 20,15 40,10 50,10 C 70,10 80,25 80,35 C 80,50 60,60 40,70 L 20,85 L 80,85',
    strokes: [
      {
        id: '2-1',
        svgPath: 'M 20,30 C 20,15 40,10 50,10 C 70,10 80,25 80,35 C 80,50 60,60 40,70 L 20,85 L 80,85',
        points: [
          { x: 0.2, y: 0.3 },
          { x: 0.25, y: 0.2 },
          { x: 0.4, y: 0.12 },
          { x: 0.5, y: 0.1 },
          { x: 0.65, y: 0.12 },
          { x: 0.8, y: 0.25 },
          { x: 0.8, y: 0.35 },
          { x: 0.75, y: 0.45 },
          { x: 0.6, y: 0.55 },
          { x: 0.4, y: 0.7 },
          { x: 0.2, y: 0.85 },
          { x: 0.5, y: 0.85 },
          { x: 0.8, y: 0.85 },
        ],
      },
    ],
  },
  3: {
    digit: 3,
    startPoint: { x: 0.2, y: 0.2 },
    svgPath: 'M 20,20 C 30,10 70,10 75,25 C 80,40 55,50 45,50 C 55,50 85,55 80,75 C 75,90 30,90 20,80',
    strokes: [
      {
        id: '3-1',
        svgPath: 'M 20,20 C 30,10 70,10 75,25 C 80,40 55,50 45,50',
        points: [
          { x: 0.2, y: 0.2 },
          { x: 0.35, y: 0.12 },
          { x: 0.55, y: 0.1 },
          { x: 0.7, y: 0.15 },
          { x: 0.75, y: 0.25 },
          { x: 0.72, y: 0.38 },
          { x: 0.6, y: 0.48 },
          { x: 0.45, y: 0.5 },
        ],
      },
      {
        id: '3-2',
        svgPath: 'M 45,50 C 55,50 85,55 80,75 C 75,90 30,90 20,80',
        points: [
          { x: 0.45, y: 0.5 },
          { x: 0.6, y: 0.52 },
          { x: 0.78, y: 0.58 },
          { x: 0.8, y: 0.7 },
          { x: 0.75, y: 0.82 },
          { x: 0.55, y: 0.88 },
          { x: 0.35, y: 0.88 },
          { x: 0.2, y: 0.8 },
        ],
      },
    ],
  },
  4: {
    digit: 4,
    startPoint: { x: 0.65, y: 0.15 },
    svgPath: 'M 65,15 L 20,60 L 80,60 M 65,15 L 65,85',
    strokes: [
      {
        id: '4-1',
        svgPath: 'M 65,15 L 20,60 L 80,60',
        points: [
          { x: 0.65, y: 0.15 },
          { x: 0.5, y: 0.32 },
          { x: 0.35, y: 0.48 },
          { x: 0.2, y: 0.6 },
          { x: 0.4, y: 0.6 },
          { x: 0.6, y: 0.6 },
          { x: 0.8, y: 0.6 },
        ],
      },
      {
        id: '4-2',
        svgPath: 'M 65,15 L 65,85',
        points: [
          { x: 0.65, y: 0.15 },
          { x: 0.65, y: 0.35 },
          { x: 0.65, y: 0.55 },
          { x: 0.65, y: 0.7 },
          { x: 0.65, y: 0.85 },
        ],
      },
    ],
  },
  5: {
    digit: 5,
    startPoint: { x: 0.75, y: 0.15 },
    svgPath: 'M 75,15 L 25,15 L 25,45 C 35,40 55,38 70,45 C 85,55 85,75 65,85 C 45,92 25,85 20,75',
    strokes: [
      {
        id: '5-1',
        svgPath: 'M 75,15 L 25,15 L 25,45',
        points: [
          { x: 0.75, y: 0.15 },
          { x: 0.55, y: 0.15 },
          { x: 0.35, y: 0.15 },
          { x: 0.25, y: 0.15 },
          { x: 0.25, y: 0.3 },
          { x: 0.25, y: 0.45 },
        ],
      },
      {
        id: '5-2',
        svgPath: 'M 25,45 C 35,40 55,38 70,45 C 85,55 85,75 65,85 C 45,92 25,85 20,75',
        points: [
          { x: 0.25, y: 0.45 },
          { x: 0.4, y: 0.4 },
          { x: 0.55, y: 0.4 },
          { x: 0.7, y: 0.45 },
          { x: 0.82, y: 0.55 },
          { x: 0.82, y: 0.68 },
          { x: 0.72, y: 0.8 },
          { x: 0.55, y: 0.88 },
          { x: 0.35, y: 0.85 },
          { x: 0.2, y: 0.75 },
        ],
      },
    ],
  },
  6: {
    digit: 6,
    startPoint: { x: 0.7, y: 0.2 },
    svgPath: 'M 70,20 C 55,10 25,15 20,40 C 15,65 20,85 50,85 C 80,85 85,65 80,55 C 75,45 55,42 40,50 C 25,58 20,70 25,80',
    strokes: [
      {
        id: '6-1',
        svgPath: 'M 70,20 C 55,10 25,15 20,40 C 15,65 20,85 50,85 C 80,85 85,65 80,55 C 75,45 55,42 40,50 C 25,58 20,70 25,80',
        points: [
          { x: 0.7, y: 0.2 },
          { x: 0.55, y: 0.12 },
          { x: 0.35, y: 0.15 },
          { x: 0.22, y: 0.28 },
          { x: 0.18, y: 0.45 },
          { x: 0.2, y: 0.62 },
          { x: 0.28, y: 0.78 },
          { x: 0.42, y: 0.85 },
          { x: 0.58, y: 0.85 },
          { x: 0.72, y: 0.78 },
          { x: 0.8, y: 0.65 },
          { x: 0.78, y: 0.52 },
          { x: 0.65, y: 0.45 },
          { x: 0.5, y: 0.48 },
          { x: 0.35, y: 0.55 },
          { x: 0.25, y: 0.68 },
          { x: 0.25, y: 0.8 },
        ],
      },
    ],
  },
  7: {
    digit: 7,
    startPoint: { x: 0.2, y: 0.15 },
    svgPath: 'M 20,15 L 80,15 L 40,85',
    strokes: [
      {
        id: '7-1',
        svgPath: 'M 20,15 L 80,15 L 40,85',
        points: [
          { x: 0.2, y: 0.15 },
          { x: 0.4, y: 0.15 },
          { x: 0.6, y: 0.15 },
          { x: 0.8, y: 0.15 },
          { x: 0.7, y: 0.35 },
          { x: 0.58, y: 0.55 },
          { x: 0.48, y: 0.72 },
          { x: 0.4, y: 0.85 },
        ],
      },
    ],
  },
  8: {
    digit: 8,
    startPoint: { x: 0.5, y: 0.48 },
    svgPath: 'M 50,48 C 30,42 22,30 28,20 C 35,10 65,10 72,20 C 78,30 70,42 50,48 C 30,54 18,68 25,80 C 32,92 68,92 75,80 C 82,68 70,54 50,48 Z',
    strokes: [
      {
        id: '8-1',
        svgPath: 'M 50,48 C 30,42 22,30 28,20 C 35,10 65,10 72,20 C 78,30 70,42 50,48',
        points: [
          { x: 0.5, y: 0.48 },
          { x: 0.38, y: 0.44 },
          { x: 0.28, y: 0.38 },
          { x: 0.25, y: 0.28 },
          { x: 0.3, y: 0.18 },
          { x: 0.42, y: 0.12 },
          { x: 0.58, y: 0.12 },
          { x: 0.7, y: 0.18 },
          { x: 0.75, y: 0.28 },
          { x: 0.72, y: 0.38 },
          { x: 0.62, y: 0.44 },
          { x: 0.5, y: 0.48 },
        ],
      },
      {
        id: '8-2',
        svgPath: 'M 50,48 C 30,54 18,68 25,80 C 32,92 68,92 75,80 C 82,68 70,54 50,48',
        points: [
          { x: 0.5, y: 0.48 },
          { x: 0.38, y: 0.52 },
          { x: 0.25, y: 0.6 },
          { x: 0.2, y: 0.72 },
          { x: 0.28, y: 0.84 },
          { x: 0.42, y: 0.9 },
          { x: 0.58, y: 0.9 },
          { x: 0.72, y: 0.84 },
          { x: 0.8, y: 0.72 },
          { x: 0.75, y: 0.6 },
          { x: 0.62, y: 0.52 },
          { x: 0.5, y: 0.48 },
        ],
      },
    ],
  },
  9: {
    digit: 9,
    startPoint: { x: 0.5, y: 0.15 },
    svgPath: 'M 50,15 C 70,15 75,25 75,35 C 75,48 65,55 50,55 C 35,55 25,48 25,35 C 25,22 35,15 50,15 C 65,15 75,22 75,35 C 75,50 72,65 65,75 C 55,88 40,88 30,80',
    strokes: [
      {
        id: '9-1',
        svgPath: 'M 50,15 C 70,15 75,25 75,35 C 75,48 65,55 50,55 C 35,55 25,48 25,35 C 25,22 35,15 50,15 C 65,15 75,22 75,35 C 75,50 72,65 65,75 C 55,88 40,88 30,80',
        points: [
          { x: 0.5, y: 0.15 },
          { x: 0.62, y: 0.15 },
          { x: 0.72, y: 0.2 },
          { x: 0.75, y: 0.28 },
          { x: 0.75, y: 0.35 },
          { x: 0.72, y: 0.45 },
          { x: 0.62, y: 0.52 },
          { x: 0.5, y: 0.55 },
          { x: 0.38, y: 0.52 },
          { x: 0.28, y: 0.45 },
          { x: 0.25, y: 0.35 },
          { x: 0.28, y: 0.25 },
          { x: 0.38, y: 0.18 },
          { x: 0.5, y: 0.15 },
          { x: 0.65, y: 0.18 },
          { x: 0.75, y: 0.35 },
          { x: 0.75, y: 0.5 },
          { x: 0.7, y: 0.65 },
          { x: 0.6, y: 0.78 },
          { x: 0.48, y: 0.85 },
          { x: 0.35, y: 0.82 },
          { x: 0.3, y: 0.8 },
        ],
      },
    ],
  },
}

export function getNumberDefinition(digit: number): NumberDefinition {
  if (digit < 0 || digit > 9) {
    throw new Error(`Invalid digit: ${digit}`)
  }
  return numberDefinitions[digit]
}

/**
 * Scale an SVG path from 0-100 space to canvas dimensions
 */
export function scaleSvgPath(path: string, width: number, height: number): string {
  return path.replace(/(\d+\.?\d*)/g, (match, num, offset, str) => {
    const value = parseFloat(num)
    const prevChar = str[offset - 1]
    
    if (prevChar === ',' || /[MLCQASZ]/i.test(prevChar) || offset === 0 || str[offset - 1] === ' ') {
      const beforeComma = str.substring(0, offset).split(/[MLCQASZ\s]/i).pop() || ''
      const commaCount = beforeComma.split(',').length - 1
      
      if (commaCount % 2 === 0) {
        return String((value / 100) * width)
      } else {
        return String((value / 100) * height)
      }
    }
    return match
  })
}

import type { NumberDefinition } from '../types/tracing'

/**
 * Number definitions with strokes in normalized [0-1] space
 * Each stroke has points sampled along the path
 */

export const numberDefinitions: Record<number, NumberDefinition> = {
  0: {
    digit: 0,
    startPoint: { x: 0.5, y: 0.2 },
    strokes: [
      {
        id: '0-1',
        points: [
          { x: 0.5, y: 0.2 },
          { x: 0.7, y: 0.25 },
          { x: 0.8, y: 0.4 },
          { x: 0.8, y: 0.6 },
          { x: 0.7, y: 0.75 },
          { x: 0.5, y: 0.8 },
          { x: 0.3, y: 0.75 },
          { x: 0.2, y: 0.6 },
          { x: 0.2, y: 0.4 },
          { x: 0.3, y: 0.25 },
          { x: 0.5, y: 0.2 },
        ],
      },
    ],
  },
  1: {
    digit: 1,
    startPoint: { x: 0.4, y: 0.2 },
    strokes: [
      {
        id: '1-1',
        points: [
          { x: 0.4, y: 0.2 },
          { x: 0.4, y: 0.3 },
          { x: 0.4, y: 0.4 },
          { x: 0.4, y: 0.5 },
          { x: 0.4, y: 0.6 },
          { x: 0.4, y: 0.7 },
          { x: 0.4, y: 0.8 },
        ],
      },
    ],
  },
  2: {
    digit: 2,
    startPoint: { x: 0.3, y: 0.3 },
    strokes: [
      {
        id: '2-1',
        points: [
          { x: 0.3, y: 0.3 },
          { x: 0.5, y: 0.2 },
          { x: 0.7, y: 0.3 },
          { x: 0.7, y: 0.45 },
          { x: 0.5, y: 0.55 },
          { x: 0.2, y: 0.65 },
          { x: 0.2, y: 0.75 },
          { x: 0.7, y: 0.8 },
        ],
      },
    ],
  },
  3: {
    digit: 3,
    startPoint: { x: 0.2, y: 0.2 },
    strokes: [
      {
        id: '3-1',
        points: [
          { x: 0.2, y: 0.2 },
          { x: 0.7, y: 0.2 },
          { x: 0.7, y: 0.35 },
          { x: 0.4, y: 0.45 },
        ],
      },
      {
        id: '3-2',
        points: [
          { x: 0.4, y: 0.45 },
          { x: 0.7, y: 0.55 },
          { x: 0.7, y: 0.7 },
          { x: 0.2, y: 0.8 },
        ],
      },
    ],
  },
  4: {
    digit: 4,
    startPoint: { x: 0.6, y: 0.2 },
    strokes: [
      {
        id: '4-1',
        points: [
          { x: 0.6, y: 0.2 },
          { x: 0.2, y: 0.5 },
        ],
      },
      {
        id: '4-2',
        points: [
          { x: 0.6, y: 0.2 },
          { x: 0.6, y: 0.8 },
        ],
      },
      {
        id: '4-3',
        points: [
          { x: 0.2, y: 0.5 },
          { x: 0.8, y: 0.5 },
        ],
      },
    ],
  },
  5: {
    digit: 5,
    startPoint: { x: 0.7, y: 0.2 },
    strokes: [
      {
        id: '5-1',
        points: [
          { x: 0.7, y: 0.2 },
          { x: 0.2, y: 0.2 },
          { x: 0.2, y: 0.45 },
          { x: 0.6, y: 0.5 },
        ],
      },
      {
        id: '5-2',
        points: [
          { x: 0.6, y: 0.5 },
          { x: 0.7, y: 0.65 },
          { x: 0.6, y: 0.8 },
          { x: 0.2, y: 0.8 },
        ],
      },
    ],
  },
  6: {
    digit: 6,
    startPoint: { x: 0.7, y: 0.2 },
    strokes: [
      {
        id: '6-1',
        points: [
          { x: 0.7, y: 0.2 },
          { x: 0.3, y: 0.2 },
          { x: 0.2, y: 0.35 },
          { x: 0.2, y: 0.5 },
          { x: 0.35, y: 0.6 },
          { x: 0.55, y: 0.6 },
          { x: 0.7, y: 0.7 },
          { x: 0.7, y: 0.8 },
          { x: 0.3, y: 0.8 },
          { x: 0.2, y: 0.7 },
        ],
      },
    ],
  },
  7: {
    digit: 7,
    startPoint: { x: 0.2, y: 0.2 },
    strokes: [
      {
        id: '7-1',
        points: [
          { x: 0.2, y: 0.2 },
          { x: 0.7, y: 0.2 },
          { x: 0.3, y: 0.8 },
        ],
      },
    ],
  },
  8: {
    digit: 8,
    startPoint: { x: 0.5, y: 0.2 },
    strokes: [
      {
        id: '8-1',
        points: [
          { x: 0.5, y: 0.2 },
          { x: 0.7, y: 0.3 },
          { x: 0.75, y: 0.45 },
          { x: 0.5, y: 0.52 },
          { x: 0.25, y: 0.45 },
          { x: 0.3, y: 0.3 },
          { x: 0.5, y: 0.2 },
        ],
      },
      {
        id: '8-2',
        points: [
          { x: 0.5, y: 0.52 },
          { x: 0.7, y: 0.6 },
          { x: 0.75, y: 0.75 },
          { x: 0.5, y: 0.8 },
          { x: 0.25, y: 0.75 },
          { x: 0.3, y: 0.6 },
          { x: 0.5, y: 0.52 },
        ],
      },
    ],
  },
  9: {
    digit: 9,
    startPoint: { x: 0.3, y: 0.2 },
    strokes: [
      {
        id: '9-1',
        points: [
          { x: 0.3, y: 0.2 },
          { x: 0.7, y: 0.2 },
          { x: 0.8, y: 0.35 },
          { x: 0.8, y: 0.5 },
          { x: 0.65, y: 0.6 },
          { x: 0.45, y: 0.6 },
          { x: 0.3, y: 0.5 },
          { x: 0.3, y: 0.2 },
        ],
      },
      {
        id: '9-2',
        points: [
          { x: 0.65, y: 0.6 },
          { x: 0.7, y: 0.75 },
          { x: 0.5, y: 0.8 },
          { x: 0.3, y: 0.75 },
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

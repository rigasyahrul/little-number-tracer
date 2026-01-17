# Plan: Fix Detection Points Alignment with Stroke Paths

## Problem Summary
Detection points (red circles in debug mode) don't align with the SVG stroke paths (orange dashed lines). This causes:
1. Users trace correctly but coverage doesn't increase
2. Manual point adjustments don't seem to take effect
3. Curved numbers (3, 6, 8, 9) are especially problematic

## Root Cause
**Coordinate system mismatch:**
- SVG paths are defined in 0-100 space, then manually scaled to pixel space via regex
- Detection points are defined in 0-1 normalized space, then multiplied by canvas dimensions
- The manual `scaleSvgPath()` function is fragile and causes drift on bezier curves

## Solution: Unified ViewBox Coordinate System

### Phase 1: Fix NumberPath.tsx (High Priority)

**Current approach (problematic):**
```tsx
// Manually scales SVG path from 0-100 to pixel coords
const scaledPath = scaleSvgPath(numberDef.svgPath, width, height)
<svg width={width} height={height}>
  <path d={scaledPath} />
</svg>
```

**New approach:**
```tsx
// Let SVG handle scaling via viewBox
<svg 
  width={width} 
  height={height}
  viewBox="0 0 100 100"
  preserveAspectRatio="none"
>
  <path d={numberDef.svgPath} /> {/* Use original path, no scaling */}
</svg>
```

**Changes required:**
1. Remove `scaleSvgPath()` function call for paths
2. Add `viewBox="0 0 100 100"` to SVG element
3. Add `preserveAspectRatio="none"` to match current behavior
4. Update debug points to use 0-100 space: `cx={point.x * 100}` instead of `cx={point.x * width}`
5. Update start marker to use 0-100 space

### Phase 2: Update StrokeArrows.tsx

The arrows component also needs to use the same coordinate system:
- Either render inside the same SVG with viewBox
- Or keep as canvas but ensure coordinates match

### Phase 3: Verify Detection Logic

The `useTracing.ts` hook should continue working as-is because:
- User points are normalized to 0-1 via `p.x / canvasWidth`
- Detection points in numberDefinitions.ts are already 0-1 normalized
- Comparison happens in normalized space

### Phase 4 (Optional): Auto-generate Points from SVG Path

For perfect alignment on curves, generate detection points programmatically:

```ts
function samplePathPoints(svgPath: string, numPoints: number): Point[] {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', svgPath)
  
  const length = path.getTotalLength()
  const points: Point[] = []
  
  for (let i = 0; i <= numPoints; i++) {
    const point = path.getPointAtLength((i / numPoints) * length)
    points.push({ x: point.x / 100, y: point.y / 100 })
  }
  
  return points
}
```

This would eliminate manual point definitions entirely.

## Files to Modify

1. `src/components/NumberPath/NumberPath.tsx` - Main fix
2. `src/components/StrokeArrows/StrokeArrows.tsx` - Coordinate alignment
3. `src/data/numberDefinitions.ts` - Optional: remove manual points if auto-generating

## Testing Checklist

- [ ] Enable "Show Points" in debug panel
- [ ] Verify red circles sit exactly on orange dashed line for all numbers 0-9
- [ ] Test tracing works correctly (coverage increases when following path)
- [ ] Test in both portrait and landscape orientations
- [ ] Test on different screen sizes (responsive)

## Estimated Effort

- Phase 1: 1-2 hours
- Phase 2: 30 minutes
- Phase 3: Verification only
- Phase 4: 2-3 hours (optional)

## Risks

1. `preserveAspectRatio="none"` may distort numbers on non-standard aspect ratios
2. StrokeArrows uses Canvas, not SVG - may need separate handling
3. Existing user drawing strokes are in pixel space - normalization must remain correct

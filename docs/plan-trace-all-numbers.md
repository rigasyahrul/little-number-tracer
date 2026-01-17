# Plan: Test All Numbers (0-9) Tracing

## Objective

Extend the Playwright E2E tests to verify tracing functionality for all numbers (0-9), not just number 1.

## Current State

- **Tested**: Only number `1` in `tests/e2e/tracing.spec.ts`
- **Helper**: `traceNumber(page, num)` already supports all numbers 0-9
- **Definitions**: All 10 numbers defined in `src/data/numberDefinitions.ts`

## Implementation Plan

### Phase 1: Parameterized Tracing Tests

**File**: `tests/e2e/tracing.spec.ts`

**Approach**: Use a loop to generate test cases for all numbers.

```typescript
test.describe('Tracing All Numbers', () => {
  for (const num of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    test(`coverage increases when tracing number ${num}`, async ({ page }) => {
      await page.goto('/')

      const viewport = page.viewportSize()
      const isMobile = viewport && viewport.width < 600

      if (isMobile) {
        test.skip()
        return
      }

      await traceNumber(page, num)

      const celebration = page.getByTestId('celebration-overlay')
      await expect(celebration).toBeVisible({ timeout: 10000 })
    })
  }
})
```

### Phase 2: Number-Specific Considerations

| Number | Strokes | Complexity | Notes |
|--------|---------|------------|-------|
| 0 | 1 | Medium | Circular path, 15 points |
| 1 | 1 | Simple | Diagonal + vertical, 6 points |
| 2 | 1 | Medium | Curve + horizontal, 20 points |
| 3 | 1 | Complex | Double curve, 23 points |
| 4 | 2 | Medium | **Multi-stroke**: diagonal + vertical |
| 5 | 1 | Complex | Horizontal + curve, 20 points |
| 6 | 1 | Complex | Spiral-like, 20 points |
| 7 | 1 | Simple | Two lines, 8 points |
| 8 | 1 | Complex | Figure-8, 23 points |
| 9 | 1 | Complex | Reverse-6, 23 points |

### Phase 3: Test Organization

**Option A - Single File (Recommended)**
Keep all tracing tests in `tracing.spec.ts` with parameterized approach.

**Option B - Separate File**
Create `tracing-all-numbers.spec.ts` for comprehensive number tests.

## Tasks

- [ ] Update `tracing.spec.ts` with parameterized tests for numbers 0-9
- [ ] Run tests to verify all numbers pass: `npm run test`
- [ ] Verify multi-stroke number 4 works correctly
- [ ] Test on both desktop and mobile viewports

## Verification

```bash
npm run test -- --grep "tracing number"
```

Expected output: 10 passing tests (one per number).

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Complex paths fail detection | Adjust tolerance in coverage calculation |
| Mobile touch events differ | Already handled in `traceNumber` helper |
| Flaky tests on CI | Add appropriate timeouts, use `waitForTimeout` |

## Estimated Effort

- **Code Changes**: ~20 lines
- **Testing**: ~30 minutes
- **Total**: ~1 hour

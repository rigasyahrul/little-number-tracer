# Testing Guide - Little Number Tracer

## ✅ Quick Local Test (5 mins)

### 1. Start Dev Server
```bash
npm install --legacy-peer-deps  # One-time setup
npm run dev
```
- Opens at `http://localhost:5173`
- Hot reload enabled (changes auto-refresh)

### 2. Basic Feature Test
1. **Number Gallery** (Home screen)
   - See grid of 0-9 numbers
   - Yellow cards (unstarted), green cards (completed)
   - Click any number

2. **Trace Number 1**
   - See dotted path with START marker
   - See animated arrows showing direction
   - Mascot in top-right should be visible
   - Draw/trace along the path
     - ✅ Line turns **green** when on-path
     - ✅ Line turns **orange** when off-path
   - Mascot should guide with pulses
   - Complete the path
     - ✅ Celebration overlay appears
     - ✅ Mascot celebrates
     - ✅ Star animation falls
   - Click "Done" → back to gallery

3. **Check Progress Saved**
   - Number 1 should show **green** with checkmark
   - Try number 1 again → "Try Again" button clears canvas
   - Open DevTools → Application → IndexedDB → NumberTracerDB → number should show `completed: true`

4. **Free Draw Mode**
   - Click "Free Draw Mode" from gallery
   - Test color palette (5 colors)
   - Draw with each color
   - Click eraser → draws white (erases)
   - Click "Clear All" → canvas clears
   - Click "Done" → back to gallery

---

## 🔧 Production Build Test (5 mins)

### Build & Test
```bash
# Build production bundle (minified, optimized)
npm run build

# Preview production build locally
npm run preview
# Opens at http://localhost:4173
```

### Verify PWA Assets
```bash
ls -lh dist/
# Should see:
# - index.html (PWA entry point)
# - manifest.webmanifest (app metadata)
# - sw.js (service worker)
# - workbox-*.js (offline caching)
# - assets/ (JS/CSS bundles)
```

---

## 📱 Browser DevTools Testing

### Service Worker Registration
1. Open DevTools (F12)
2. Go to **Application** tab
3. Check **Service Workers** section
   - ✅ SW should be "registered and running"
   - Status: `activated and running`

### Offline Testing
1. Keep DevTools open
2. Go to **Network** tab
3. Check "Offline" checkbox
4. Refresh page (Ctrl+R)
   - ✅ Page should load fully
   - ✅ Gallery visible with previous progress
   - ✅ Canvas works
5. Uncheck "Offline"

### Manifest Testing
1. Go to **Application** → **Manifest**
   - ✅ Name: "Little Number Tracer"
   - ✅ Display: "standalone"
   - ✅ Theme color: "#FEF6E4" (cream)
   - ✅ Icons: 192x192, 512x512 listed

### IndexedDB Inspection
1. Go to **Application** → **Storage** → **IndexedDB**
2. Expand **NumberTracerDB**
   - ✅ Should have `progress` object store
   - Open it and see entries for digits 0-9
   - Check `completed: true` for traced numbers

### Cache Storage
1. Go to **Application** → **Cache Storage**
   - ✅ Should see `v0` cache (Workbox-generated)
   - Should contain index.html, JS/CSS bundles
   - Google Fonts cache (if fonts loaded)

---

## 🌐 PWA Installation Tests

### Chrome/Edge (Windows/Mac/Android)
1. Go to `http://localhost:4173`
2. Click **menu** (⋮) → **Install app**
   - ✅ Dialog appears
   - ✅ Title: "Little Number Tracer"
3. Click "Install"
   - ✅ App launches in fullscreen
   - ✅ No URL bar visible
   - ✅ Shows on taskbar/home screen

### Firefox
1. Go to `http://localhost:4173`
2. Click **menu** (☰) → **Install app**
   - ✅ Dialog appears
3. Click "Install"
   - ✅ App launches fullscreen

### iOS Safari
1. Open Safari → Go to `http://localhost:4173`
   - *Note: Must use iPhone/iPad, not simulator*
2. Tap **Share** (↗️)
3. Scroll down → Tap **Add to Home Screen**
   - ✅ Name: "Number Tracer"
   - ✅ Icon shown
4. Tap **Add**
5. Launch from home screen
   - ✅ Opens fullscreen
   - ✅ No Safari UI
   - ✅ Canvas works with touch

---

## 🎮 Feature-Specific Tests

### Number Tracing (All digits 0-9)

**Test each number:**
- Select digit
- Verify dotted path visible
- Verify direction arrows animate
- Trace the path
- Verify on-path detection (green)
- Verify off-path detection (orange)
- Complete all strokes
- Verify celebration plays

**Multi-stroke numbers** (3, 4, 5, 6, 8, 9):
- After first stroke completes, path updates to next stroke
- Progress counter shows "Stroke 1 of 2" etc.

### Mascot States

| Action | Expected State | Animation |
|--------|---|---|
| Start tracing | `guiding` | Pulse |
| Trace on-path | Stays guiding | Continues |
| Trace off-path | `guiding` | Pulse |
| Complete number | `celebrate` | Bounce |
| After 2 sec | Reverts to `idle` | — |

### Celebration Overlay

1. Complete a number
2. Observe:
   - ✅ Full-screen dark overlay appears
   - ✅ "Great Job!" text centered
   - ✅ 🎉 emoji bounces
   - ✅ Falling ⭐ stars animate
   - ✅ Click anywhere or wait 3 sec → closes
   - ✅ Success sound plays (check browser audio)

### Free Draw Mode

| Feature | Test | Expected |
|---------|------|----------|
| **Color 1** | Select green | Draw green line |
| **Color 2** | Select yellow | Draw yellow line |
| **Eraser** | Toggle eraser | Line becomes white (erases) |
| **Clear** | Click clear all | Entire canvas erases |
| **Smooth drawing** | Fast drag on canvas | Line is smooth, not jagged |
| **Touch** | Use touch (tablet) | Works on touch input |

---

## 🐛 Debugging Tips

### Console Errors
1. Open DevTools → **Console** tab
2. Should see NO red errors
3. May see yellow warnings (normal)
4. Should see: `Service Worker registered: ServiceWorkerContainer {...}`

### Canvas Issues
If drawing doesn't appear:
1. Check browser console for errors
2. Ensure `touch-action: none` applied to canvas
3. Test in different browser

### Offline Issues
If offline doesn't work:
1. Ensure SW is registered
2. Hard refresh (Ctrl+Shift+R) to clear old SW
3. Check "Update on reload" in SW dev settings
4. Check Cache Storage has entries

### Audio Not Playing
1. **Browser policy**: Audio requires user interaction (touch/click first)
2. Click mascot or canvas first, then test sound
3. Check if muted: Open DevTools → toggle Howler audio

---

## 📊 Performance Test

### Lighthouse Audit (Chrome DevTools)
1. DevTools → **Lighthouse** tab
2. Select "Mobile"
3. Click "Analyze page load"
4. Expected scores:
   - ✅ **Performance**: 85+
   - ✅ **Accessibility**: 90+
   - ✅ **Best Practices**: 90+
   - ✅ **SEO**: 100
   - ✅ **PWA**: 90+

### Build Size Check
```bash
npm run build
# Expected output:
# dist/assets/index-*.js ~252 KB (gzipped ~78 KB)
# dist/assets/index-*.css ~10.6 KB (gzipped ~2.8 KB)
```

---

## 🎯 Full Test Checklist

### Setup
- [ ] `npm install --legacy-peer-deps` runs without errors
- [ ] `npm run dev` starts on localhost:5173
- [ ] `npm run build` completes in <5 seconds
- [ ] `npm run preview` starts on localhost:4173

### Tracing
- [ ] All numbers 0-9 trace correctly
- [ ] On-path detection (green) works
- [ ] Off-path detection (orange) works
- [ ] Direction arrows animate
- [ ] Multi-stroke numbers sequence correctly
- [ ] "Try Again" resets canvas and counts attempts

### UI/UX
- [ ] Mascot shows correct emoji states
- [ ] Celebration overlay appears on completion
- [ ] Free draw colors work
- [ ] Eraser works
- [ ] All buttons are large (48x48px minimum)
- [ ] Layout responsive on mobile

### Persistence
- [ ] Completed numbers show green badge
- [ ] Progress persists after refresh
- [ ] IndexedDB has progress data
- [ ] Attempts counted correctly

### PWA
- [ ] Service worker registered
- [ ] Offline mode works (network disabled)
- [ ] Can install on desktop
- [ ] Can install on mobile
- [ ] Manifest loads correctly

### Quality
- [ ] No console errors (TS type errors)
- [ ] No runtime JavaScript errors
- [ ] Lighthouse scores 85+ across all metrics
- [ ] Linting passes: `npm run lint`

---

## 📝 Test Results Template

```
Date: ____________________
Tester: ____________________
Browser: ____________________
Device: ____________________

✅ Development Server: [ ] PASS [ ] FAIL
✅ Production Build: [ ] PASS [ ] FAIL
✅ Number Tracing: [ ] PASS [ ] FAIL
✅ Mascot/Celebrations: [ ] PASS [ ] FAIL
✅ Free Draw: [ ] PASS [ ] FAIL
✅ Offline Mode: [ ] PASS [ ] FAIL
✅ PWA Install: [ ] PASS [ ] FAIL
✅ Performance (Lighthouse): [ ] PASS [ ] FAIL

Notes:
_________________________________________________________________________
_________________________________________________________________________
```

---

## 🚀 Next Steps After Testing

If all tests pass:
1. Deploy to production
2. Test on real devices
3. Gather user feedback from children
4. Monitor analytics/errors
5. Plan next features (sound effects, more animations, etc.)

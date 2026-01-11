# Little Number Tracer 🎓✏️

A progressive web app for children ages 3-6 to learn number writing (0-9) through interactive touch tracing with instant visual and audio feedback.

**Tech Stack**: React 18 + Vite + TypeScript + Tailwind CSS + Zustand + IndexedDB + Howler.js + Vite PWA

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- For iOS: Safari supports PWA installation

### Installation

```bash
# Clone repository
git clone https://github.com/rigasyahrul/little-number-tracer.git
cd little-number-tracer

# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev
```

Dev server runs at `http://localhost:5173` with hot reload enabled.

---

## 🧪 Testing

### Local Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Lint Code
```bash
npm run lint
```

### Feature Testing Checklist

#### Number Tracing (M2-M3)
1. Navigate to number gallery
2. Click any number (0-9)
3. Trace along the dotted path
4. Observe:
   - ✅ Green glow when on-path
   - ✅ Orange highlight when off-path
   - ✅ Stroke arrows showing direction
   - ✅ Advance to next stroke on completion

#### Mascot & Celebrations (M4)
1. Complete a full number trace
2. Observe:
   - ✅ Mascot celebrates with animation
   - ✅ Celebration overlay with falling stars
   - ✅ Success sound plays

#### Practice Mode (M6)
1. After completing a number, click "Try Again"
2. Observe:
   - ✅ Canvas clears
   - ✅ Attempt counter increments
   - ✅ Best accuracy tracked

#### Free Draw Mode (M6)
1. From gallery, click "Free Draw Mode"
2. Test:
   - ✅ Color palette (5 colors)
   - ✅ Eraser tool toggles
   - ✅ Clear all button
   - ✅ Smooth drawing on touch/mouse

#### Offline & PWA (M7)
1. Open DevTools → Application tab
2. Check:
   - ✅ Service worker registered
   - ✅ Manifest loaded
   - ✅ Indexed DB has `NumberTracerDB`
3. Disable network in DevTools
4. Refresh page
5. Verify:
   - ✅ App loads fully offline
   - ✅ Gallery still shows completed numbers
   - ✅ Canvas works

#### Install PWA
**Chrome/Android:**
1. Click menu → "Install app"
2. Verify fullscreen, no address bar

**iOS Safari:**
1. Tap Share → Add to Home Screen
2. Launch from home screen
3. Verify standalone mode

---

## 📁 Project Structure

```
src/
├── components/
│   ├── TracingCanvas/       # Drawing input component
│   ├── NumberPath/          # Dotted path overlay
│   ├── StrokeArrows/        # Direction animation
│   ├── Mascot/              # Character with emoji states
│   ├── CelebrationOverlay/  # Success animation
│   ├── NumberGallery.tsx    # 0-9 selection grid
│   ├── TracingScreen.tsx    # Main tracing interface
│   └── FreeDrawScreen.tsx   # Creative drawing mode
├── data/
│   └── numberDefinitions.ts # Stroke paths for 0-9
├── stores/
│   └── progressStore.ts     # Zustand + IndexedDB
├── hooks/
│   └── useTracing.ts        # Path detection logic
├── utils/
│   └── pathDetection.ts     # Proximity algorithms
├── audio/
│   └── AudioManager.ts      # Howler.js wrapper
├── types/
│   └── tracing.ts           # TypeScript interfaces
├── App.tsx                  # Main app shell
└── main.tsx                 # Entry point + SW registration
```

---

## 🎨 Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Background | Cream | `#FEF6E4` |
| Primary | Yellow | `#F4D35E` |
| Success | Green | `#52B788` |
| Warning | Orange | `#FFB84D` |
| Info | Blue | `#4ECDC4` |
| Accent | Pink | `#FF6B9D` |

---

## 📊 Features by Requirement

| REQ | Feature | Status | Milestone |
|-----|---------|--------|-----------|
| REQ-001 | Number tracing with dotted path | ✅ | M2-M3 |
| REQ-002 | Stroke direction arrows | ✅ | M3 |
| REQ-003 | Touch tracing detection | ✅ | M3 |
| REQ-004 | Animated mascot companion | ✅ | M4 |
| REQ-005 | Celebration animations | ✅ | M4 |
| REQ-006 | Number gallery selection | ✅ | M5 |
| REQ-007 | Practice mode | ✅ | M6 |
| REQ-008 | Free draw mode | ✅ | M6 |
| REQ-009 | Kid-friendly color scheme | ✅ | M1 |

---

## 🔧 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server w/ HMR |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on all files |

---

## 📱 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari (Mac) | 14+ | ✅ Full |
| Safari (iOS) | 14+ | ✅ Full (PWA) |
| Edge | 90+ | ✅ Full |

---

## 🐛 Known Limitations

- Audio playback requires user interaction (browser policy)
- Icons currently use SVG placeholders (can be replaced with PNG)
- Lottie animations not yet integrated (using CSS/emoji)
- Path detection tuned for 400x500px canvas

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Serve Static Files
```bash
npm run preview  # Local testing
# OR deploy dist/ folder to any static host:
# - Vercel: `vercel deploy`
# - Netlify: `netlify deploy --prod`
# - AWS S3 + CloudFront
# - GitHub Pages
```

### PWA Requirements Met
✅ HTTPS required for SW (all hosts provide)
✅ manifest.json with icons & theme colors
✅ Service worker for offline caching
✅ 192x192 & 512x512 app icons
✅ Full-screen standalone support

---

## 📚 Documentation

- [Implementation Plan](./docs/IMPLEMENTATION-PLAN.md) - Detailed milestones
- [Architecture](./docs/ARCHITECTURE.md) - System design
- [Requirements](./docs/REQ.md) - Feature specifications
- [Color Palette](./docs/COLOR-PALETTE.md) - Design system

---

## 👨‍💻 Development

### Adding a New Feature
1. Create component in `src/components/`
2. Add types to `src/types/tracing.ts`
3. Update `src/App.tsx` routing if needed
4. Test with `npm run dev`
5. Build & verify: `npm run build`

### Modifying Number Strokes
Edit `src/data/numberDefinitions.ts` - each stroke is array of (x, y) points in [0-1] space.

### Tuning Path Detection
Adjust thresholds in `src/hooks/useTracing.ts`:
- `coverageThreshold`: % of path points needed (default: 0.7 = 70%)
- `onPathThreshold`: % of user points on path (default: 0.5 = 50%)
- `tolerance`: proximity radius (default: 0.15 = 15% of canvas)

---

## 📄 License

MIT - See LICENSE file

---

## ✨ Credits

Built for children ages 3-6 to learn number writing through play.

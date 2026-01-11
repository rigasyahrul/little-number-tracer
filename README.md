# Little Number Tracer 🎓✏️

A progressive web app for children ages 3-6 to learn number writing (0-9) through interactive touch tracing with instant visual feedback.

## Local Setup

### Prerequisites

- Node.js 18+ and npm
- Modern browser (Chrome, Firefox, Safari, or Edge)

### Installation

```bash
# Clone repository
git clone https://github.com/rigasyahrul/little-number-tracer.git
cd little-number-tracer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
# Build
npm run build

# Preview the build locally
npm run preview
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Tech Stack

- **React 18** + **TypeScript** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **IndexedDB** - Local progress storage
- **Vite PWA** - Offline support

## Features

- ✏️ Interactive number tracing (0-9)
- 🎯 Real-time path detection with visual feedback
- 🎨 Free draw mode with color palette
- 📱 PWA - installable and works offline
- 🎉 Celebration animations on completion

## Project Structure

```
src/
├── components/          # React components
│   ├── TracingCanvas/   # Drawing input
│   ├── NumberPath/      # SVG number guides
│   ├── NumberGallery.tsx
│   ├── TracingScreen.tsx
│   └── FreeDrawScreen.tsx
├── data/
│   └── numberDefinitions.ts  # SVG paths for 0-9
├── hooks/
│   └── useTracing.ts    # Tracing logic
├── stores/
│   └── progressStore.ts # Zustand + IndexedDB
└── App.tsx
```

## Customization

### Modify Number Paths

Edit `src/data/numberDefinitions.ts`. Each number has:
- `svgPath` - SVG path with Bezier curves (0-100 coordinate space)
- `points` - Detection points (0-1 normalized space)
- `startPoint` - Where the START marker appears

### Tune Detection Sensitivity

Edit `src/hooks/useTracing.ts`:
- `coverageThreshold` - % of path that must be traced (default: 70%)
- `onPathThreshold` - % of user points that must be on path (default: 50%)
- `tolerance` - How close user must be to path (default: 15% of canvas)

---

## License

MIT

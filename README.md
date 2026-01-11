# Little Number Tracer 🎓✏️

A progressive web app for children ages 3–6 to learn number writing (0–9) through interactive touch tracing with instant visual feedback.

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

The Vite dev server runs at:

- http://localhost:5173

### Build for Production

```bash
# Build
npm run build

# Preview the build locally on this machine
npm run preview
```

The production preview server runs at:

- http://localhost:4173

For testing on other devices on your Wi‑Fi (e.g. a tablet), see **Testing on Tablet** below.

### Available Scripts

| Command              | Description                                                                 |
| -------------------- | --------------------------------------------------------------------------- |
| `npm run dev`        | Start development server with hot reload                                   |
| `npm run build`      | Build for production                                                       |
| `npm run preview`    | Preview production build locally on this machine                           |
| `npm run preview:lan`| Preview production build and print your LAN IP for testing on other devices |
| `npm run lint`       | Run ESLint                                                                 |

---

## Tech Stack

- **React 18** + **TypeScript** – UI framework
- **Vite** – Build tool / dev server
- **Tailwind CSS** – Styling
- **Zustand** – State management
- **IndexedDB** – Local progress storage
- **Vite PWA** – Offline support / installable PWA

## Features

- ✏️ Interactive number tracing (0–9)
- 🎯 Real-time path detection with visual feedback
- 🎨 Free draw mode with color palette
- 📱 PWA – installable and works offline
- 💻 Responsive layout with tablet‑optimized **landscape mode** (number picker sidebar on the right)
- 🎉 Celebration animations on completion

## Project Structure

```text
src/
├── components/          # React components
│   ├── TracingCanvas/   # Drawing input
│   ├── NumberPath/      # SVG number guides
│   ├── NumberGallery.tsx
│   ├── TracingScreen.tsx
│   └── FreeDrawScreen.tsx
├── data/
│   └── numberDefinitions.ts  # SVG paths for 0–9
├── hooks/
│   └── useTracing.ts    # Tracing logic
├── stores/
│   └── progressStore.ts # Zustand + IndexedDB
└── App.tsx
```

## Testing on Tablet

You can test the production build on a tablet (or any device) over your local Wi‑Fi using the LAN preview script.

1. **Build the app**

   ```bash
   npm run build
   ```

2. **Start LAN preview**

   ```bash
   npm run preview:lan
   ```

   This will:

   - Start `vite preview` on port **4173**
   - Print your local IP address, for example:

     ```text
     📱 Your local IP:
     192.168.1.23

     Open http://<IP>:4173 on your tablet
     ```

3. **Connect your tablet**

   - Make sure your tablet is on the **same Wi‑Fi network** as your development machine.
   - On the tablet's browser (Chrome, Safari, etc.), open:

     ```text
     http://<YOUR_LOCAL_IP>:4173
     ```

4. **Use landscape mode**

   - Rotate the tablet to **landscape**.
   - The UI will show a **number picker sidebar on the right** for easier selection while tracing.

5. **Install as a PWA (optional)**

   - On supported browsers, use *"Add to Home Screen"* or the install prompt.
   - Once installed, the app can be launched fullscreen and used **offline** thanks to PWA support.

## Deployment

### Deploying to Cloudflare Pages

Cloudflare Pages can build and host the app directly from your Git repository.

1. **Push the project to GitHub**

2. **Create a new Pages project**

   - Go to **Cloudflare Dashboard → Pages → Create a project**.
   - Choose **"Connect to Git"** and select your repository.

3. **Configure build settings**

   | Setting | Value |
   |---------|-------|
   | Framework preset | `Vite` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

4. **Advanced settings**

   | Setting | Value |
   |---------|-------|
   | Assets directory | `/` |
   | HTML handling | `auto-trailing-slash` |
   | Not found handling | `Single-Page Application` |

5. **Deploy**

   - Click Deploy and wait for the build to complete.
   - Cloudflare will provide a production URL.

---

## Customization

### Modify Number Paths

Edit `src/data/numberDefinitions.ts`. Each number has:

- `svgPath` – SVG path with Bézier curves (0–100 coordinate space)
- `points` – Detection points (0–1 normalized space)
- `startPoint` – Where the `START` marker appears

### Tune Detection Sensitivity

Edit `src/hooks/useTracing.ts`:

- `coverageThreshold` – % of path that must be traced (default: 70%)
- `onPathThreshold` – % of user points that must be on path (default: 50%)
- `tolerance` – How close user must be to path (default: 15% of canvas)

---

## License

MIT

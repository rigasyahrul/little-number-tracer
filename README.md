# Little Number Tracer

An engaging, tablet-friendly React app that helps young children (roughly ages 3–6) learn to write numbers 0–9 by tracing them with their fingers or a stylus. Little Number Tracer combines playful visuals, audio feedback, and gentle progress tracking to support early math and fine motor skills.

---

## Features

- ✏️ **Number Tracing Practice (0–9)**  
  - Number gallery screen to choose digits 0–9  
  - Guided tracing canvas for each number  
  - Designed for finger or stylus input on tablets

- 🎨 **Free Draw Mode**  
  - Open drawing area for creative practice  
  - Helps children get comfortable with strokes and shapes before/after structured tracing

- ⭐ **Progress Tracking**  
  - Remembers which numbers a child has practiced  
  - Uses a lightweight store (Zustand) persisted to **IndexedDB**  
  - Progress is kept locally on the device, even after closing the app

- 🔊 **Audio Feedback**  
  - Uses **Howler.js** for sound effects  
  - Positive feedback reinforces successful tracing and encourages repetition

- 🎉 **Celebration Animations**  
  - Fun **Lottie animations** when children complete a number  
  - Visual rewards to motivate continued learning

- 📱 **Optimized for Tablets & PWA**  
  - Responsive layout tailored for tablets in landscape or portrait  
  - **PWA** support with offline capabilities  
  - Add to home screen to feel like a native app

- 🧪 **LAN Preview for Real-Device Testing**  
  - Special script to preview the app on tablets/phones over your local network  
  - Perfect for quickly testing the experience with children on physical devices

---

## Tech Stack

- **Frontend Framework:** React + TypeScript
- **Bundler / Dev Server:** Vite
- **State Management:** Zustand
- **Persistence:** IndexedDB (via `idb`)
- **Audio:** Howler.js
- **Animations:** Lottie (via `lottie-react`)
- **Styling:** Tailwind CSS (with PostCSS + Autoprefixer)
- **PWA:** `vite-plugin-pwa`
- **Tooling:** ESLint, TypeScript, React Fast Refresh

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or `pnpm` / `yarn` if you prefer; examples below use npm)

### Installation

Clone the repo and install dependencies:

```bash
git clone git@github-rigasyahrul:rigasyahrul/little-number-tracer.git
cd little-number-tracer
npm install
```

### Development Server

Run the app in development mode:

```bash
npm run dev
```

Then open the URL printed in your terminal, typically:

```text
http://localhost:5173
```

Vite will hot-reload changes as you edit the source files.

---

## Running on a Tablet (LAN Preview)

To test the experience on an actual tablet or phone connected to the same Wi‑Fi network:

1. Build and preview the app via LAN:

   ```bash
   npm run build
   npm run preview:lan
   ```

2. The script prints your local IP address, for example:

   ```text
   📱 Your local IP:
   192.168.1.42

   Open http://<IP>:4173 on your tablet
   ```

3. On the tablet:
   - Open a browser (e.g., Chrome or Safari).
   - Go to `http://192.168.1.42:4173` (replace with your actual IP).
   - You should now see **Little Number Tracer** on the tablet.

This is the recommended way to validate touch interactions, tracing accuracy, and overall usability with children.

---

## PWA & Offline Usage

Little Number Tracer is configured as a **Progressive Web App**:

- When opened over HTTPS (or via `npm run preview` / `npm run preview:lan`), modern browsers will:
  - Offer an **"Install App"** or **"Add to Home Screen"** prompt.
  - Cache assets so the app can work **offline** after the first load.

**For parents and educators:**

- Install the app on a child's tablet home screen.
- After installation and one full load, the app can be used without an internet connection.
- Progress is stored locally; no account or cloud connection is required.

---

## Project Scripts

- **`npm run dev`** – Start Vite dev server with hot reload.
- **`npm run build`** – Type-check (`tsc -b`) and create a production build.
- **`npm run preview`** – Preview the production build locally at `http://localhost:4173`.
- **`npm run preview:lan`** – Same as preview, but prints your local IP for testing on real devices over LAN.
- **`npm run lint`** – Run ESLint across the project.

---

## Usage Overview

### For Parents & Educators

1. **Choose a number**  
   From the **Number Gallery**, tap a digit (0–9) to open the tracing screen.

2. **Trace the number**  
   - Use a finger or stylus to trace along the number shape.
   - Audio and visual feedback respond to the child's strokes.

3. **Celebrate completion**  
   - When a number is successfully traced, a **celebration animation** plays.
   - The app quietly tracks which numbers have been completed to support structured practice.

4. **Explore Free Draw mode**  
   - From the main screen, open **Free Draw** to let children doodle and experiment with shapes and strokes in a low-pressure environment.

5. **Return to the gallery**  
   - Use the **Back** button in the header at any time to choose another number or switch modes.

### For Developers

Core entry point: `App.tsx`, which controls three main views:

- `gallery` → `<NumberGallery />` (selection of digits, entry point to Free Draw)
- `tracing` → `<TracingScreen />` (main learning experience)
- `freeDraw` → `<FreeDrawScreen />` (creative mode)

Progress is handled via a Zustand store (`useProgressStore`) that:

- Hydrates from IndexedDB on app load.
- Persists practice/completion state locally.

---

## Educational Focus

Little Number Tracer is built with early numeracy and fine motor development in mind:

- Encourages **repeated practice** of number forms (0–9).
- Supports **hand–eye coordination** and **pen control** through tracing.
- Uses **positive reinforcement** (sound + animation) instead of punishment or scores.
- Keeps everything **local and simple**—no sign-up, ads, or distractions.

---

## Contributing

If you'd like to extend or customize the app (e.g., add letters, shapes, or multiple profiles):

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and add/update tests or linting as needed.
4. Open a pull request with a clear description of your changes.

---

## License

See [LICENSE](LICENSE) for details.

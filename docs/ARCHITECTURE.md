# Architecture

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language | TypeScript | Type safety, better DX, catches errors early for maintainable codebase |
| Framework | React 18+ with Vite | Fast development, excellent ecosystem, user preference, good PWA support |
| PWA | Vite PWA Plugin + Workbox | Service worker generation, offline caching, easy PWA manifest setup |
| Canvas/Drawing | HTML5 Canvas API or React Konva | Touch drawing support, good performance for tracing detection |
| Animations | Lottie (lottie-react) | Rich mascot animations, small file size, designer-friendly workflow |
| Audio | Howler.js | Reliable cross-browser audio, sprite support for sound effects |
| Storage | IndexedDB via idb or Dexie.js | Offline-first local storage, stores progress data persistently |
| Styling | Tailwind CSS | Rapid UI development, easy to create kid-friendly rounded colorful components |
| State Management | Zustand | Lightweight, simple API, good for app state and progress tracking |

## Components

### 1. TracingCanvas
Core canvas component for number tracing with touch detection

**Dependencies:** Canvas API, Touch events

### 2. NumberPath
Renders dotted paths and stroke arrows for each number 0-9

**Dependencies:** TracingCanvas

### 3. Mascot
Animated pencil companion using Lottie animations

**Dependencies:** lottie-react

### 4. NumberGallery
Grid view for selecting numbers to practice

**Dependencies:** ProgressStore

### 5. CelebrationOverlay
Confetti and celebration animations on completion

**Dependencies:** Lottie, AudioManager

### 6. FreeDrawCanvas
Blank canvas with color picker for creative drawing

**Dependencies:** Canvas API

### 7. AudioManager
Handles sound effects playback

**Dependencies:** Howler.js

### 8. ProgressStore
Zustand store for tracking completed numbers and scores

**Dependencies:** Zustand, IndexedDB

## Deployment

Static hosting (Vercel, Netlify, or GitHub Pages) as PWA with offline support

## Architecture Decision Records

### ADR-001: PWA over Native App

**Decision:** Build as Progressive Web App using React

**Rationale:** No app store approval needed, instant updates, works on any device with browser, easier maintenance

### ADR-002: Offline-First Architecture

**Decision:** Use Service Workers and IndexedDB for full offline capability

**Rationale:** Kids may use app without internet, progress must persist locally

### ADR-003: Local-Only Storage

**Decision:** Store all data in IndexedDB, no backend required

**Rationale:** Simplifies architecture, no server costs, privacy-friendly for children

### ADR-004: Lottie for Mascot Animations

**Decision:** Use Lottie format for all mascot and celebration animations

**Rationale:** Rich animations with small file size, can be created in After Effects or Rive

### ADR-005: Canvas-Based Tracing

**Decision:** Use HTML5 Canvas for tracing detection rather than SVG

**Rationale:** Better performance for continuous touch tracking, easier path deviation detection


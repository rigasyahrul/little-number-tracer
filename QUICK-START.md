# Quick Start Guide 🚀

Get Little Number Tracer running in 2 minutes.

## Installation (1 min)

```bash
git clone https://github.com/rigasyahrul/little-number-tracer.git
cd little-number-tracer
npm install --legacy-peer-deps
```

## Run Locally (1 min)

### Development Server (with hot reload)
```bash
npm run dev
# Opens http://localhost:5173
```

### Production Build & Test
```bash
npm run build    # Creates optimized dist/
npm run preview  # Opens http://localhost:4173
```

## ✅ Test It

1. **Home Screen**: See 10 numbers (0-9) in yellow grid
2. **Select Number**: Click "1"
3. **Trace**: Draw along dotted path
   - 🟢 Green = on-path
   - 🟠 Orange = off-path
4. **Complete**: Finish the path
   - 🎉 Celebration plays
   - ⭐ Stars fall
5. **Repeat**: Try other numbers
6. **Free Draw**: Click "Free Draw Mode" to draw with 5 colors
7. **Check Progress**: Number 1 now shows ✓ checkmark (green)

## 📱 Test Offline

1. **DevTools** → Network → Check **Offline**
2. **Refresh** page
3. ✅ Should work fully offline
4. Uncheck Offline

## 📲 Install as PWA

### Chrome/Edge
- Menu → Install app → Click Install

### Firefox  
- Menu → Install app → Click Install

### iOS Safari
- Share → Add to Home Screen → Add

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Full feature & deployment docs |
| [TESTING-GUIDE.md](./TESTING-GUIDE.md) | Detailed testing procedures |
| [docs/IMPLEMENTATION-PLAN.md](./docs/IMPLEMENTATION-PLAN.md) | Milestone breakdown |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design |

---

## 🔧 Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server w/ hot reload |
| `npm run build` | Production build |
| `npm run preview` | Preview prod build locally |
| `npm run lint` | Check code quality |

---

## 🐛 Issues?

1. **Port 5173 in use?** → Change in `vite.config.ts`
2. **npm install fails?** → Try `npm install --legacy-peer-deps`
3. **Canvas not drawing?** → Check browser console (F12)
4. **Offline not working?** → Hard refresh (Ctrl+Shift+R)

---

## ✨ What's Working

✅ Trace all numbers 0-9  
✅ On/off-path detection  
✅ Direction arrows  
✅ Mascot reactions  
✅ Celebration animations  
✅ Progress persistence (IndexedDB)  
✅ Free draw with colors  
✅ Full offline support  
✅ PWA installable  

---

Enjoy learning to write numbers! 🎨📝

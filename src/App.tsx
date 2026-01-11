import { useState, useEffect } from 'react'
import { NumberGallery } from './components/NumberGallery'
import { TracingScreen } from './components/TracingScreen'
import { FreeDrawScreen } from './components/FreeDrawScreen'
import { useProgressStore } from './stores/progressStore'

type AppView = 'gallery' | 'tracing' | 'freeDraw'

export function App() {
  const [view, setView] = useState<AppView>('gallery')
  const [selectedNumber, setSelectedNumber] = useState<number>(0)
  const { hydrate } = useProgressStore()

  useEffect(() => {
    hydrate()
  }, [])

  const handleSelectNumber = (num: number) => {
    setSelectedNumber(num)
    setView('tracing')
  }

  const handleBackToGallery = () => {
    setView('gallery')
  }

  const handleOpenFreeDrawMode = () => {
    setView('freeDraw')
  }

  const getTitle = () => {
    if (view === 'freeDraw') return 'Little Number Tracer - Free Draw'
    if (view === 'tracing') return `Little Number Tracer - Number ${selectedNumber}`
    return 'Little Number Tracer'
  }

  return (
    <div className="w-full h-full flex flex-col bg-background-cream">
      {/* Header */}
      <header className="bg-primary-yellow shadow-md p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-dark">{getTitle()}</h1>
        {view !== 'gallery' && (
          <button
            onClick={handleBackToGallery}
            className="px-4 py-2 bg-text-light text-text-dark rounded-lg font-semibold hover:bg-gray-100"
          >
            Back
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4">
        {view === 'gallery' && (
          <NumberGallery
            onSelectNumber={handleSelectNumber}
            onOpenFreeDraw={handleOpenFreeDrawMode}
          />
        )}
        {view === 'tracing' && (
          <TracingScreen
            key={selectedNumber}
            number={selectedNumber}
            onComplete={() => handleBackToGallery()}
            onSelectNumber={(n) => setSelectedNumber(n)}
          />
        )}
        {view === 'freeDraw' && (
          <FreeDrawScreen onClose={handleBackToGallery} />
        )}
      </main>
    </div>
  )
}

export default App

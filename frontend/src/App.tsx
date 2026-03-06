import { useState } from 'react'
import './App.css'
import ToneSelection from './components/ToneSelection'
import AdventureFeed from './components/AdventureFeed'
import type { AdventureSegment } from './components/AdventureFeed'
import PromptInput from './components/PromptInput'

function App() {
  const [tone, setTone] = useState<string | null>(null)
  const [segments, setSegments] = useState<AdventureSegment[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleToneSelect = (selectedTone: string) => {
    setTone(selectedTone)
    setSegments([
      { id: '1', text: `Starting a ${selectedTone} adventure...` }
    ])
  }

  const handlePromptSubmit = (prompt: string) => {
    setIsLoading(true)
    const newSegment: AdventureSegment = {
      id: Date.now().toString(),
      text: prompt
    }
    setSegments(prev => [...prev, newSegment])
    
    // Simulate API call for now
    setTimeout(() => {
      setSegments(prev => prev.map(s => 
        s.id === newSegment.id ? { ...s, imageData: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==' } : s
      ))
      setIsLoading(false)
    }, 1000)
  }

  const handleReset = () => {
    setTone(null)
    setSegments([])
  }

  return (
    <div className="app-container">
      <h1>Random Adventures</h1>
      
      {!tone ? (
        <ToneSelection onSelect={handleToneSelect} />
      ) : (
        <>
          <div className="game-controls">
            <button onClick={handleReset}>Reset Adventure</button>
            <p>Tone: <strong>{tone}</strong></p>
          </div>
          <AdventureFeed segments={segments} />
          <PromptInput onSubmit={handlePromptSubmit} disabled={isLoading} />
        </>
      )}
    </div>
  )
}

export default App

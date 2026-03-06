import { useState, useCallback } from 'react'
import './App.css'
import ToneSelection from './components/ToneSelection'
import AdventureFeed from './components/AdventureFeed'
import type { AdventureSegment } from './components/AdventureFeed'
import PromptInput from './components/PromptInput'
import { generateNarrative, generateImage } from './api/narrative'

function App() {
  const [tone, setTone] = useState<string | null>(null)
  const [segments, setSegments] = useState<AdventureSegment[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleToneSelect = useCallback(async (selectedTone: string) => {
    setTone(selectedTone)
    setIsLoading(true)
    
    try {
      const response = await generateNarrative("Start a new adventure", selectedTone, [])
      const initialSegment: AdventureSegment = {
        id: Date.now().toString(),
        text: response.text
      }
      setSegments([initialSegment])
      setIsLoading(false) // Text is here, skeleton replaced by segment, but image still generating
      
      generateImage(response.text).then(imageData => {
        setSegments(prev => prev.map(s => 
          s.id === initialSegment.id ? { ...s, imageData } : s
        ))
      }).catch(console.error)
      
    } catch (error) {
      console.error("Failed to start adventure:", error)
      setIsLoading(false)
    }
  }, [])

  const handlePromptSubmit = useCallback(async (prompt: string) => {
    if (!tone) return
    setIsLoading(true)
    
    const history = segments.map(s => s.text)
    
    try {
      const response = await generateNarrative(prompt, tone, history)
      const newSegment: AdventureSegment = {
        id: Date.now().toString(),
        text: response.text
      }
      setSegments(prev => [...prev, newSegment])
      setIsLoading(false) // Text is here
      
      generateImage(response.text).then(imageData => {
        setSegments(prev => prev.map(s => 
          s.id === newSegment.id ? { ...s, imageData } : s
        ))
      }).catch(console.error)
      
    } catch (error) {
      console.error("Failed to continue adventure:", error)
      setIsLoading(false)
    }
  }, [tone, segments])

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
          <AdventureFeed segments={segments} isGenerating={isLoading} />
          <PromptInput onSubmit={handlePromptSubmit} disabled={isLoading} />
        </>
      )}
    </div>
  )
}

export default App

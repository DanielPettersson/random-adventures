import { useState, useCallback, useMemo } from 'react'
import './App.css'
import ToneSelection from './components/ToneSelection'
import AdventureFeed from './components/AdventureFeed'
import type { AdventureSegment } from './components/AdventureFeed'
import PromptInput from './components/PromptInput'
import CameraComponent from './components/CameraComponent'
import LanguageSelection from './components/LanguageSelection'
import { generateNarrative, generateImage, generateAudio, playAudio } from './api/narrative'

function App() {
  const [tone, setTone] = useState<string | null>(null)
  const [segments, setSegments] = useState<AdventureSegment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [playerPhoto, setPlayerPhoto] = useState<string | undefined>(undefined)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)

  const defaultLanguage = useMemo(() => {
    const lang = navigator.language.split('-')[0]
    switch (lang) {
      case 'sv': return 'Swedish'
      case 'es': return 'Spanish'
      case 'fr': return 'French'
      case 'de': return 'German'
      default: return 'English'
    }
  }, [])

  const [language, setLanguage] = useState<string>(defaultLanguage)

  const handleToneSelect = useCallback(async (selectedTone: string) => {
    setTone(selectedTone)
    setIsLoading(true)
    
    try {
      const response = await generateNarrative("Start a new adventure", selectedTone, [], language)
      const initialSegment: AdventureSegment = {
        id: Date.now().toString(),
        text: response.text
      }
      setSegments([initialSegment])
      setIsLoading(false) // Text is here, skeleton replaced by segment, but image still generating
      
      generateImage(response.text, playerPhoto).then(imageData => {
        setSegments(prev => prev.map(s => 
          s.id === initialSegment.id ? { ...s, imageData } : s
        ))
      }).catch(console.error)

      if (isAudioEnabled) {
        generateAudio(response.text, language).then(({ audioData, mimeType }) => {
          setSegments(prev => prev.map(s => 
            s.id === initialSegment.id ? { ...s, audioData, mimeType } : s
          ))
          playAudio(audioData, mimeType)
        }).catch(console.error)
      }
      
    } catch (error) {
      console.error("Failed to start adventure:", error)
      setIsLoading(false)
    }
  }, [playerPhoto, language, isAudioEnabled])

  const handlePromptSubmit = useCallback(async (prompt: string) => {
    if (!tone) return
    setIsLoading(true)
    
    const history = segments.map(s => s.text)
    
    try {
      const response = await generateNarrative(prompt, tone, history, language)
      const newSegment: AdventureSegment = {
        id: Date.now().toString(),
        text: response.text,
        prompt: prompt
      }
      setSegments(prev => [...prev, newSegment])
      setIsLoading(false) // Text is here
      
      generateImage(response.text, playerPhoto).then(imageData => {
        setSegments(prev => prev.map(s => 
          s.id === newSegment.id ? { ...s, imageData } : s
        ))
      }).catch(console.error)

      if (isAudioEnabled) {
        generateAudio(response.text, language).then(({ audioData, mimeType }) => {
          setSegments(prev => prev.map(s => 
            s.id === newSegment.id ? { ...s, audioData, mimeType } : s
          ))
          playAudio(audioData, mimeType)
        }).catch(console.error)
      }
      
    } catch (error) {
      console.error("Failed to continue adventure:", error)
      setIsLoading(false)
    }
  }, [tone, segments, playerPhoto, language, isAudioEnabled])

  const handleReset = () => {
    setTone(null)
    setSegments([])
    setPlayerPhoto(undefined)
    setIsCameraOpen(false)
  }

  const handleCapture = (photo: string) => {
    setPlayerPhoto(photo)
    setIsCameraOpen(false)
  }

  return (
    <div className={`app-container ${tone ? 'adventure-started' : ''}`}>
      {!tone && <h1>Random Adventures</h1>}

      {!tone && (
        <div className="start-screen-controls" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LanguageSelection selectedLanguage={language} onLanguageChange={setLanguage} />
          <button onClick={() => setIsCameraOpen(!isCameraOpen)}>
            {playerPhoto ? 'Change Photo' : 'Add Photo'}
          </button>
          <label style={{ marginTop: '10px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={isAudioEnabled} 
              onChange={(e) => setIsAudioEnabled(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Text-to-Speech
          </label>
          {playerPhoto && !isCameraOpen && (
            <div style={{ marginTop: '10px' }}>
              <img src={playerPhoto} alt="Player" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
          )}
          {isCameraOpen && (
            <div data-testid="camera-container" style={{ marginTop: '20px' }}>
              <CameraComponent onCapture={handleCapture} />
            </div>
          )}
        </div>
      )}
      
      {!tone ? (
        <ToneSelection onSelect={handleToneSelect} />
      ) : (
        <>
          <div className="game-controls">
            <button onClick={handleReset}>Reset Adventure</button>
            <label style={{ marginLeft: '15px', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={isAudioEnabled} 
                onChange={(e) => setIsAudioEnabled(e.target.checked)}
                style={{ marginRight: '5px' }}
              />
              TTS
            </label>
            <p>Tone: <strong>{tone}</strong> | Language: <strong>{language}</strong></p>
            {playerPhoto && (
              <img src={playerPhoto} alt="Player" style={{ width: '40px', height: '40px', borderRadius: '50%', marginLeft: '10px', objectFit: 'cover' }} />
            )}
          </div>
          <AdventureFeed segments={segments} isGenerating={isLoading} />
          
          <div className="camera-integration" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            {isCameraOpen ? (
              <div data-testid="camera-container" style={{ marginBottom: '10px' }}>
                <CameraComponent onCapture={handleCapture} />
                <button onClick={() => setIsCameraOpen(false)} style={{ marginTop: '5px' }}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
                 <button onClick={() => setIsCameraOpen(true)} style={{ fontSize: '0.8rem', padding: '2px 8px' }}>
                   {playerPhoto ? 'Update Photo' : 'Add Photo'}
                 </button>
              </div>
            )}
            <PromptInput onSubmit={handlePromptSubmit} disabled={isLoading} />
          </div>
        </>
      )}
    </div>
  )
}

export default App

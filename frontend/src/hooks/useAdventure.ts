import { useState, useCallback } from 'react'
import type { AdventureSegment } from '../components/AdventureFeed'

export const useAdventure = () => {
  const [tone, setTone] = useState<string | null>(null)
  const [segments, setSegments] = useState<AdventureSegment[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const selectTone = useCallback((selectedTone: string) => {
    setTone(selectedTone)
    const initialSegment: AdventureSegment = {
      id: 'initial',
      text: `Starting a ${selectedTone} adventure...`
    }
    setSegments([initialSegment])
    return initialSegment.id
  }, [])

  const addSegment = useCallback((text: string, prompt?: string) => {
    const id = Date.now().toString()
    const newSegment: AdventureSegment = { id, text, prompt }
    setSegments((prev) => [...prev, newSegment])
    return id
  }, [])

  const updateSegmentImage = useCallback((id: string, imageData: string) => {
    setSegments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, imageData } : s))
    )
  }, [])

  const reset = useCallback(() => {
    setTone(null)
    setSegments([])
    setIsLoading(false)
  }, [])

  return {
    tone,
    segments,
    isLoading,
    setIsLoading,
    selectTone,
    addSegment,
    updateSegmentImage,
    reset
  }
}

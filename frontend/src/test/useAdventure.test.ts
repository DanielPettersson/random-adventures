import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAdventure } from '../hooks/useAdventure'

describe('useAdventure', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useAdventure())
    expect(result.current.tone).toBeNull()
    expect(result.current.segments).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it('sets tone and initializes first segment', () => {
    const { result } = renderHook(() => useAdventure())
    act(() => {
      result.current.selectTone('Epic')
    })
    expect(result.current.tone).toBe('Epic')
    expect(result.current.segments.length).toBe(1)
    expect(result.current.segments[0].text).toContain('Epic')
  })

  it('adds a new segment with prompt', () => {
    const { result } = renderHook(() => useAdventure())
    act(() => {
      result.current.selectTone('Dark')
    })
    act(() => {
      result.current.addSegment('The cave is cold.', 'Go to the cave')
    })
    expect(result.current.segments.length).toBe(2)
    expect(result.current.segments[1].text).toBe('The cave is cold.')
    expect(result.current.segments[1].prompt).toBe('Go to the cave')
  })

  it('updates a segment with image data', () => {
    const { result } = renderHook(() => useAdventure())
    let segmentId: string
    act(() => {
      result.current.selectTone('Humorous')
    })
    act(() => {
      segmentId = result.current.addSegment('Dance with the goblin')
    })
    
    act(() => {
      result.current.updateSegmentImage(segmentId, 'image-data')
    })
    
    const segment = result.current.segments.find(s => s.id === segmentId)
    expect(segment?.imageData).toBe('image-data')
  })

  it('updates a segment with audio data', () => {
    const { result } = renderHook(() => useAdventure())
    let segmentId: string
    act(() => {
      result.current.selectTone('Humorous')
    })
    act(() => {
      segmentId = result.current.addSegment('Dance with the goblin')
    })
    
    act(() => {
      result.current.updateSegmentAudio(segmentId, 'audio-data', 'audio/mpeg')
    })
    
    const segment = result.current.segments.find(s => s.id === segmentId)
    expect(segment?.audioData).toBe('audio-data')
    expect(segment?.mimeType).toBe('audio/mpeg')
  })

  it('resets state', () => {
    const { result } = renderHook(() => useAdventure())
    act(() => {
      result.current.selectTone('Epic')
      result.current.addSegment('Fight the dragon')
      result.current.reset()
    })
    expect(result.current.tone).toBeNull()
    expect(result.current.segments).toEqual([])
  })
})

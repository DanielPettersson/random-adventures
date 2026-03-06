import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as narrativeApi from '../api/narrative'

describe('narrative api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generateNarrative calls the client with correct params', async () => {
    const mockResponse = { text: 'The story continues...' }
    const spy = vi.spyOn(narrativeApi.client, 'generateNarrative').mockResolvedValue(mockResponse as any)

    const result = await narrativeApi.generateNarrative('test prompt', 'Epic', ['history 1'])
    
    expect(spy).toHaveBeenCalledWith({
      prompt: 'test prompt',
      tone: 'Epic',
      history: ['history 1'],
    })
    expect(result).toEqual(mockResponse)
  })

  it('generateImage calls the client and returns base64', async () => {
    const mockImageData = new Uint8Array([71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 128, 0, 0, 255, 255, 255, 0, 0, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 68, 1, 0, 59])
    const mockResponse = { imageData: mockImageData }
    const spy = vi.spyOn(narrativeApi.client, 'generateImage').mockResolvedValue(mockResponse as any)

    const result = await narrativeApi.generateImage('forest')
    
    expect(spy).toHaveBeenCalledWith({ prompt: 'forest' })
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })

  it('generateAudio calls the client and returns base64 and mimeType', async () => {
    const mockAudioData = new Uint8Array([1, 2, 3])
    const mockResponse = { audioData: mockAudioData, mimeType: 'audio/mpeg' }
    const spy = vi.spyOn(narrativeApi.client, 'generateAudio').mockResolvedValue(mockResponse as any)

    const result = await narrativeApi.generateAudio('Hello', 'English')
    
    expect(spy).toHaveBeenCalledWith({ text: 'Hello', language: 'English' })
    expect(result.audioData).toBeDefined()
    expect(typeof result.audioData).toBe('string')
    expect(result.mimeType).toBe('audio/mpeg')
  })

  it('playAudio creates a blob and plays it', () => {
    const mockAudio = {
      play: vi.fn().mockResolvedValue(undefined),
      onended: null,
    }
    const AudioMock = vi.fn().mockImplementation(function() {
      return mockAudio
    })
    vi.stubGlobal('Audio', AudioMock)
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('mock-url'),
      revokeObjectURL: vi.fn(),
    })
    
    const createObjectURLSpy = vi.mocked(URL.createObjectURL)

    const base64Data = btoa(String.fromCharCode(1, 2, 3))
    narrativeApi.playAudio(base64Data, 'audio/mpeg')

    expect(AudioMock).toHaveBeenCalledWith('mock-url')
    expect(mockAudio.play).toHaveBeenCalled()
    expect(createObjectURLSpy).toHaveBeenCalled()
    const blob = createObjectURLSpy.mock.calls[0][0] as Blob
    expect(blob.type).toBe('audio/mpeg')
  })

  it('playAudio handles audio/L16 by adding WAV header', () => {
    const mockAudio = {
      play: vi.fn().mockResolvedValue(undefined),
      onended: null,
    }
    const AudioMock = vi.fn().mockImplementation(function() {
      return mockAudio
    })
    vi.stubGlobal('Audio', AudioMock)
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('mock-url'),
      revokeObjectURL: vi.fn(),
    })
    const createObjectURLSpy = vi.mocked(URL.createObjectURL)

    const base64Data = btoa(String.fromCharCode(1, 2, 3))
    narrativeApi.playAudio(base64Data, 'audio/L16;rate=24000')

    expect(createObjectURLSpy).toHaveBeenCalled()
    const blob = createObjectURLSpy.mock.calls[0][0] as Blob
    expect(blob.type).toBe('audio/wav')
    expect(mockAudio.play).toHaveBeenCalled()
  })
})

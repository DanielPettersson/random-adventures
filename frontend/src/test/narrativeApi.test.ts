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
})

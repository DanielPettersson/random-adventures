import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'
import { generateNarrative, generateImage } from '../api/narrative'

// Mock the API
vi.mock('../api/narrative', () => ({
  generateNarrative: vi.fn(),
  generateImage: vi.fn().mockResolvedValue('mockImageData')
}))

describe('App Component', () => {
  const mockStream = {
    getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }]),
  }

  beforeEach(() => {
    vi.stubGlobal('navigator', {
      language: 'en-US',
      mediaDevices: {
        getUserMedia: vi.fn().mockResolvedValue(mockStream),
      },
    })
    
    vi.spyOn(HTMLVideoElement.prototype, 'play').mockImplementation(() => Promise.resolve())
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders the header when no tone is selected', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /Random Adventures/i })).toBeInTheDocument()
  })

  it('hides the header when a tone is selected and the adventure starts', async () => {
    vi.mocked(generateNarrative).mockResolvedValue({ text: 'Once upon a time...' })
    
    render(<App />)
    
    // Select a tone
    const fantasyButton = screen.getByRole('button', { name: /Dark/i })
    fireEvent.click(fantasyButton)
    
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Random Adventures/i })).not.toBeInTheDocument()
    })
  })

  it('updates the feed with user prompt when submitted', async () => {
    vi.mocked(generateNarrative)
      .mockResolvedValueOnce({ text: 'Starting adventure...' })
      .mockResolvedValueOnce({ text: 'You see a monster.' })
    
    render(<App />)
    
    // Start adventure
    fireEvent.click(screen.getByRole('button', { name: /Dark/i }))
    await waitFor(() => screen.getByText(/Starting adventure/i))
    
    // Submit prompt
    const input = screen.getByPlaceholderText(/Type your next move/i)
    fireEvent.change(input, { target: { value: 'I run away' } })
    fireEvent.submit(screen.getByRole('button', { name: /Send/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/I run away/i)).toBeInTheDocument()
      expect(screen.getByText(/You see a monster/i)).toBeInTheDocument()
    })
  })

  it('renders the camera toggle and shows camera when clicked', async () => {
    render(<App />)
    
    // Find toggle button
    const cameraToggle = screen.getByRole('button', { name: /Add Photo/i })
    expect(cameraToggle).toBeInTheDocument()
    
    // Click toggle to show camera
    fireEvent.click(cameraToggle)
    
    expect(screen.getByTestId('camera-container')).toBeInTheDocument()
  })

  it('passes the player photo to generateImage when starting adventure', async () => {
    const generateImageSpy = vi.mocked(generateImage)
    render(<App />)
    
    // Capture photo
    fireEvent.click(screen.getByRole('button', { name: /Add Photo/i }))
    const captureButton = await screen.findByRole('button', { name: /Capture/i })
    
    // Mock canvas toDataURL
    const mockDataUrl = 'data:image/png;base64,fake-photo'
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(mockDataUrl)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
        drawImage: vi.fn(),
    } as any)
    
    fireEvent.click(captureButton)
    
    // Start adventure
    vi.mocked(generateNarrative).mockResolvedValue({ text: 'Starting adventure...' })
    fireEvent.click(screen.getByRole('button', { name: /Dark/i }))
    
    await waitFor(() => {
      expect(generateImageSpy).toHaveBeenCalledWith(expect.any(String), mockDataUrl)
    })
  })
})

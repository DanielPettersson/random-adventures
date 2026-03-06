import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CameraComponent from '../components/CameraComponent'

describe('CameraComponent', () => {
  const mockStream = {
    getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }]),
  }

  const originalNavigator = global.navigator

  beforeEach(() => {
    // Mock navigator.mediaDevices
    const mockMediaDevices = {
      getUserMedia: vi.fn().mockResolvedValue(mockStream),
    }
    
    vi.stubGlobal('navigator', {
      ...originalNavigator,
      mediaDevices: mockMediaDevices,
    })
    
    // Mock HTMLMediaElement.prototype.play
    vi.spyOn(HTMLVideoElement.prototype, 'play').mockImplementation(() => Promise.resolve())
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('requests camera permission and displays video on mount', async () => {
    render(<CameraComponent onCapture={vi.fn()} />)
    
    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ video: true })
    }, { timeout: 2000 })
    expect(screen.getByTestId('camera-video')).toBeInTheDocument()
  })

  it('captures a photo and calls onCapture with base64 data', async () => {
    const onCapture = vi.fn()
    render(<CameraComponent onCapture={onCapture} />)
    
    // Wait for camera to be ready and capture button to appear
    const captureButton = await screen.findByRole('button', { name: /Capture/i })

    // Mock canvas toDataURL
    const mockDataUrl = 'data:image/png;base64,fake-photo'
    
    // We need to mock the canvas element created by the component
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(mockDataUrl)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
        drawImage: vi.fn(),
    } as any)

    fireEvent.click(captureButton)
    
    expect(onCapture).toHaveBeenCalledWith(mockDataUrl)
  })

  it('displays error message if camera access is denied', async () => {
    vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(new Error('Permission denied'))
    
    render(<CameraComponent onCapture={vi.fn()} />)
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to access camera/i)).toBeInTheDocument()
    }, { timeout: 2000 })
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'
import { generateNarrative } from '../api/narrative'

// Mock the API
vi.mock('../api/narrative', () => ({
  generateNarrative: vi.fn(),
  generateImage: vi.fn().mockResolvedValue('mockImageData')
}))

describe('App Component', () => {
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
})

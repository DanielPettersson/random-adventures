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
})

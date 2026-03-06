import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AdventureFeed from '../components/AdventureFeed'

describe('AdventureFeed', () => {
  const segments = [
    { id: '1', text: 'Once upon a time...', imageData: 'base64-data-1' },
    { id: '2', text: 'Suddenly, a dragon appeared!', imageData: '' },
  ]

  it('renders all narrative segments', () => {
    render(<AdventureFeed segments={segments} />)
    expect(screen.getByText(/Once upon a time/i)).toBeInTheDocument()
    expect(screen.getByText(/Suddenly, a dragon appeared/i)).toBeInTheDocument()
  })

  it('renders user prompts when provided', () => {
    const segmentsWithPrompt = [
      ...segments,
      { id: '3', text: 'You found a treasure!', prompt: 'I open the chest' }
    ]
    render(<AdventureFeed segments={segmentsWithPrompt} />)
    expect(screen.getByText(/I open the chest/i)).toBeInTheDocument()
  })

  it('renders images when imageData is provided', () => {
    render(<AdventureFeed segments={segments} />)
    const images = screen.getAllByRole('img')
    expect(images.length).toBe(1)
    expect(images[0]).toHaveAttribute('src', 'data:image/png;base64,base64-data-1')
  })

  it('renders placeholder when imageData is missing', () => {
    render(<AdventureFeed segments={segments} />)
    expect(screen.getByText(/Generating image.../i)).toBeInTheDocument()
  })
})

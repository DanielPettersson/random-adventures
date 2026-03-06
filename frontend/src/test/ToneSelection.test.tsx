import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ToneSelection from '../components/ToneSelection'

describe('ToneSelection', () => {
  it('renders all tone buttons', () => {
    render(<ToneSelection onSelect={vi.fn()} />)
    expect(screen.getByText(/Dark/i)).toBeInTheDocument()
    expect(screen.getByText(/Humorous/i)).toBeInTheDocument()
    expect(screen.getByText(/Epic/i)).toBeInTheDocument()
    expect(screen.getByText(/Children story/i)).toBeInTheDocument()
  })

  it('calls onSelect with correct tone when a button is clicked', () => {
    const onSelect = vi.fn()
    render(<ToneSelection onSelect={onSelect} />)
    
    fireEvent.click(screen.getByText(/Epic/i))
    expect(onSelect).toHaveBeenCalledWith('Epic')
  })
})

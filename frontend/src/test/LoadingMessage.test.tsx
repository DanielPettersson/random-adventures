import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import LoadingMessage from '../components/LoadingMessage'

describe('LoadingMessage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders an initial loading message', () => {
    render(<LoadingMessage />)
    const message = screen.getByTestId('loading-message')
    expect(message).toBeInTheDocument()
    expect(message.textContent).not.toBe('')
  })

  it('cycles to a new message after some time', () => {
    render(<LoadingMessage />)
    const firstMessage = screen.getByTestId('loading-message').textContent
    
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    
    const secondMessage = screen.getByTestId('loading-message').textContent
    expect(secondMessage).not.toBe(firstMessage)
  })
})

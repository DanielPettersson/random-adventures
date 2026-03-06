import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import PromptInput from '../components/PromptInput'

describe('PromptInput', () => {
  it('renders input and submit button', () => {
    render(<PromptInput onSubmit={vi.fn()} disabled={false} />)
    expect(screen.getByPlaceholderText(/Type your next move.../i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument()
  })

  it('calls onSubmit with input value and clears input', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<PromptInput onSubmit={onSubmit} disabled={false} />)
    
    const input = screen.getByPlaceholderText(/Type your next move.../i)
    await user.type(input, 'Open the mysterious door')
    await user.click(screen.getByRole('button', { name: /Send/i }))
    
    expect(onSubmit).toHaveBeenCalledWith('Open the mysterious door')
    expect(input).toHaveValue('')
  })

  it('is disabled when disabled prop is true', () => {
    render(<PromptInput onSubmit={vi.fn()} disabled={true} />)
    expect(screen.getByPlaceholderText(/Type your next move.../i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /Send/i })).toBeDisabled()
  })
})

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LoadingSkeleton from '../components/LoadingSkeleton'

describe('LoadingSkeleton', () => {
  it('renders both image and text skeleton blocks', () => {
    const { container } = render(<LoadingSkeleton />)
    
    const imageSkeleton = container.querySelector('.skeleton-image')
    const textSkeleton = container.querySelector('.skeleton-text')
    
    expect(imageSkeleton).toBeInTheDocument()
    expect(textSkeleton).toBeInTheDocument()
  })

  it('applies the pulse animation class to skeleton blocks', () => {
    const { container } = render(<LoadingSkeleton />)
    
    const skeletonBlocks = container.querySelectorAll('.pulse-glow')
    expect(skeletonBlocks.length).toBeGreaterThanOrEqual(2)
  })

  it('has correct accessibility attributes', () => {
    render(<LoadingSkeleton />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText(/Generating content/i)).toHaveClass('sr-only')
  })
})

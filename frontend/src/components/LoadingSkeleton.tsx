import React from 'react'

const LoadingSkeleton: React.FC = () => {
  return (
    <div 
      className="adventure-segment loading-skeleton"
      role="status"
      aria-live="polite"
      aria-label="Generating new adventure segment"
    >
      <div className="segment-image skeleton-image pulse-glow" aria-hidden="true"></div>
      <div className="segment-text skeleton-text pulse-glow" aria-hidden="true">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>
      <span className="sr-only">Generating content...</span>
    </div>
  )
}

export default LoadingSkeleton

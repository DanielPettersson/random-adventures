import React from 'react'

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="adventure-segment loading-skeleton magical-glow">
      <div className="segment-image skeleton-image pulse"></div>
      <div className="segment-text skeleton-text pulse">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>
    </div>
  )
}

export default LoadingSkeleton

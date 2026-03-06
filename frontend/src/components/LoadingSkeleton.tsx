import React from 'react'

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="adventure-segment loading-skeleton">
      <div className="segment-image skeleton-image pulse-glow"></div>
      <div className="segment-text skeleton-text pulse-glow">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>
    </div>
  )
}

export default LoadingSkeleton

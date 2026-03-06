import React from 'react'
import LoadingSkeleton from './LoadingSkeleton'

export interface AdventureSegment {
  id: string
  text: string
  imageData?: string
  prompt?: string
}

interface AdventureFeedProps {
  segments: AdventureSegment[]
  isGenerating?: boolean
}

const AdventureFeed: React.FC<AdventureFeedProps> = ({ segments, isGenerating }) => {
  return (
    <div className="adventure-feed">
      {segments.map((segment) => (
        <div key={segment.id} className="adventure-segment-wrapper">
          {segment.prompt && (
            <div className="user-prompt">
              <p>{segment.prompt}</p>
            </div>
          )}
          <div className="adventure-segment">
            <div className="segment-image">
              {segment.imageData ? (
                <img 
                  src={`data:image/png;base64,${segment.imageData}`} 
                  alt="AI generated adventure scene" 
                />
              ) : (
                <div className="image-placeholder">Generating image...</div>
              )}
            </div>
            <div className="segment-text">
              <p>{segment.text}</p>
            </div>
          </div>
        </div>
      ))}
      {isGenerating && <LoadingSkeleton />}
    </div>
  )
}

export default AdventureFeed

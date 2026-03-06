import React from 'react'

export interface AdventureSegment {
  id: string
  text: string
  imageData?: string
}

interface AdventureFeedProps {
  segments: AdventureSegment[]
}

const AdventureFeed: React.FC<AdventureFeedProps> = ({ segments }) => {
  return (
    <div className="adventure-feed">
      {segments.map((segment) => (
        <div key={segment.id} className="adventure-segment">
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
      ))}
    </div>
  )
}

export default AdventureFeed

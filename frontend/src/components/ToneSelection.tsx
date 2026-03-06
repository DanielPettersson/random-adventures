import React from 'react'

interface ToneSelectionProps {
  onSelect: (tone: string) => void
}

const ToneSelection: React.FC<ToneSelectionProps> = ({ onSelect }) => {
  const tones = ['Dark', 'Humorous', 'Epic']

  return (
    <div className="tone-selection">
      <h2>Choose your adventure tone</h2>
      <div className="tone-buttons">
        {tones.map((tone) => (
          <button key={tone} onClick={() => onSelect(tone)}>
            {tone}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ToneSelection

import React, { useState, useEffect } from 'react'

const messages = [
  "Consulting the Oracle...",
  "Dreaming of distant lands...",
  "Weaving the threads of fate...",
  "Whispering to the winds...",
  "Unveiling the mystery...",
  "Chasing the horizons...",
  "Igniting the spark of adventure..."
]

const LoadingMessage: React.FC = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="loading-message-container" data-testid="loading-message">
      <p className="loading-message-text">{messages[index]}</p>
    </div>
  )
}

export default LoadingMessage

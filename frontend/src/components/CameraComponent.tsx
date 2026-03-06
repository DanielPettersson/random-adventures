import React, { useEffect, useRef, useState } from 'react'

interface CameraComponentProps {
  onCapture: (photo: string) => void
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          // Ensure autoPlay works in all browsers
          videoRef.current.play().catch(e => console.error("Error playing video:", e))
        }
      } catch (err) {
        console.error('Error accessing camera:', err)
        setError('Failed to access camera. Please ensure you have given permission.')
      }
    }

    setupCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth || 640
        canvasRef.current.height = videoRef.current.videoHeight || 480
        context.drawImage(videoRef.current, 0, 0)
        const photoData = canvasRef.current.toDataURL('image/png')
        onCapture(photoData)
      }
    }
  }

  return (
    <div className="camera-component" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
      {error ? (
        <div className="camera-error" style={{ color: 'red' }}>{error}</div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            data-testid="camera-video"
            style={{ width: '100%', maxWidth: '320px', backgroundColor: '#000', borderRadius: '4px' }}
          />
          <button onClick={handleCapture} className="capture-button" style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Capture
          </button>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
      )}
    </div>
  )
}

export default CameraComponent

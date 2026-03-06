import React, { useEffect, useRef, useState } from 'react'

interface CameraComponentProps {
  onCapture: (photo: string) => void
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMounted = useRef(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    isMounted.current = true
    let activeStream: MediaStream | null = null

    async function setupCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera API not supported in this browser.')
        return
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
        
        if (!isMounted.current) {
          mediaStream.getTracks().forEach(track => track.stop())
          return
        }

        activeStream = mediaStream
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          try {
            await videoRef.current.play()
          } catch (e) {
            if (isMounted.current) {
              console.error("Error playing video:", e)
            }
          }
        }
      } catch (err) {
        if (isMounted.current) {
          console.error('Error accessing camera:', err)
          setError('Failed to access camera. Please ensure you have given permission.')
        }
      }
    }

    setupCamera()

    return () => {
      isMounted.current = false
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        // Use intrinsic video dimensions
        const width = videoRef.current.videoWidth || 640
        const height = videoRef.current.videoHeight || 480
        canvasRef.current.width = width
        canvasRef.current.height = height
        context.drawImage(videoRef.current, 0, 0, width, height)
        
        // Use image/jpeg for smaller payload
        const photoData = canvasRef.current.toDataURL('image/jpeg', 0.8)
        onCapture(photoData)
      }
    }
  }

  return (
    <div className="camera-component" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', background: '#1a1a1a' }}>
      {error ? (
        <div className="camera-error" style={{ color: '#ff4444', padding: '10px', textAlign: 'center' }}>{error}</div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            data-testid="camera-video"
            style={{ width: '100%', maxWidth: '320px', backgroundColor: '#000', borderRadius: '4px', transform: 'scaleX(-1)' }} // Mirror view for better UX
          />
          <button 
            onClick={handleCapture} 
            className="capture-button" 
            style={{ 
              padding: '8px 24px', 
              cursor: 'pointer', 
              background: '#d4af37', 
              color: '#000', 
              border: 'none', 
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            Capture Photo
          </button>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
      )}
    </div>
  )
}

export default CameraComponent

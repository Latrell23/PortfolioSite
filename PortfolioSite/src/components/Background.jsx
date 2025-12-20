import React, { useRef, useEffect, useState } from 'react'
import backgroundVideo from "../assets/HeroSectionLoop.mp4"

export default function Background() {
  const videoRef = useRef(null)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    // iOS Safari requires user interaction or programmatic play with muted
    const video = videoRef.current
    if (video) {
      // Attempt to play video programmatically for iOS Safari
      const playPromise = video.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Video is playing successfully
          })
          .catch((error) => {
            // Autoplay was prevented, show fallback
            console.log('Video autoplay failed:', error)
            setVideoFailed(true)
          })
      }
    }
  }, [])

  return (
    <div className='os-background'>
      {!videoFailed && (
        <video
          ref={videoRef}
          className='os-video'
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          preload="auto"
          onError={() => setVideoFailed(true)}
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video.
        </video>
      )}
    </div>
  )
}

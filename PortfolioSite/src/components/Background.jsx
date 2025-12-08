import React from 'react'
import backgroundVideo from "../assets/HeroSectionLoop.mp4"

export default function Background() {
  return (
    <div className='os-background'>
        <video className='os-video' autoPlay muted loop playsInline>
            <source src={backgroundVideo} type="video/mp4" />
            Your browser does not support the video.
        </video>

    </div>
  )
}

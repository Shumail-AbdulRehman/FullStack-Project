import React from 'react'

function VideoPlayer({ videoFile, thumbnail }) {
  return (
    <div className="relative w-full pt-[56.25%] bg-black rounded-xl overflow-hidden">
      <video
        controls
        poster={thumbnail}
        src={videoFile}
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        Your browser doesnt support the video tag.
      </video>
    </div>
  )
}

export default VideoPlayer

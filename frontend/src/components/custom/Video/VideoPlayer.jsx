import React from 'react'
import { useMutation,useQueryClient } from '@tanstack/react-query'


function VideoPlayer({ videoFile, thumbnail,videoId }) {

  const queryClient=useQueryClient();
  const {mutate}=useMutation({
    mutationFn:async()=>
    {

    }
  })

  const handlePlay=async ()=>
  {
    
  }

  return (
    <div className="relative w-full pt-[56.25%] bg-black rounded-xl overflow-hidden">
      <video
        controls
        poster={thumbnail}
        src={videoFile}
        onPlay={handlePlay}
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        Your browser doesnt support the video tag.
      </video>
    </div>
  )
}

export default VideoPlayer

import React, { useState } from 'react'
import { useMutation,useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux';
import axios from 'axios';

function VideoPlayer({ videoFile, thumbnail,videoId }) {

  const userData=useSelector((state)=> state.auth.userData)
  const [hasCountedView,setHasCountedView]=useState(false);
  const [hasAddedToWatchHistory,setHasAddedToWatchHistory]=useState(false)
  const queryClient=useQueryClient();

  const {mutate:increaseViewCount}=useMutation({
    mutationFn:async()=>
    {
      const res=await axios.patch(`http://localhost:8000/api/v1/videos/incrementViewsCount/${videoId}`,{},{withCredentials:true}) 
      console.log("increase view count re is :::",res.data.data);
      return res.data.data
    },
    onSuccess:()=>
    {
      queryClient.invalidateQueries(["videos",videoId]);
    }
  })

  const handlePlay=async ()=>
  {
    if(hasCountedView && hasAddedToWatchHistory) return ;
    addToWatchHistory();
    increaseViewCount();
    setHasCountedView(true);
    setHasAddedToWatchHistory(true);

  }

  const {mutate:addToWatchHistory}=useMutation({
    mutationFn:async()=>
    {
      const res=await axios.post(`http://localhost:8000/api/v1/users/add-watch-history/${videoId}`,{},{withCredentials:true});
      console.log(res.data.data);

      return res.data.data;
    }
  })

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

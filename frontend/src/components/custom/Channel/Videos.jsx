import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import VideoCard from '../VideoCard';
import LoadingSpinner from '../LoadingSpinner';

function Videos({channelId}) {


const {data:userVideos=[],isLoading:fetchingUserVideos,isError:fetchingUserVideosError,refetch:refetchUserVideos}=useQuery({

    queryKey:["channelVideos",channelId],
    queryFn:async()=>
    {
        const res=await axios.get(`http://localhost:8000/api/v1/videos/c/${channelId}`,{withCredentials:true});
        console.log("res ijdj is ::::=>",res.data.data)
        return res.data.data;
    }
});

console.log("chnanel vidoes api response is :::",userVideos);


if(fetchingUserVideos)
{
    return (
        <div>
            <LoadingSpinner/>
        </div>
    )
}

if(userVideos.length==0)
{
    return (
        <div>
            <h1>No videos found</h1>
        </div>
    )
}

else
{
    return (
    <div>
        {userVideos.map((video)=> (
            <VideoCard {...video}/>
        ))}
    </div>
  )
}

}

export default Videos

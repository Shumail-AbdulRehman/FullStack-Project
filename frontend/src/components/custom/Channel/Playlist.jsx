import React from 'react'
import CreatePlaylist from './CreatePlaylist'
import VideoCard from '../VideoCard'
import { useSelector } from 'react-redux'
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

function Playlist() {
// /c/:channelId
  const userData = useSelector((state) => state.auth.userData);
  console.log("userdata::",userData)

  const {data:userVideos}=useQuery({
    queryKey:["userVidoes",userData?._id],
    queryFn:async()=>
    {
        const res=await axios.get(`http://localhost:8000/api/v1/videos/c/${userData?._id}`,{withCredentials:true});
        console.log("uservidoes::",res.data.data);
        return res.data.data
    }
  })

  return (
    <div className='bg-black text-2xl text-white'>
      <CreatePlaylist userVideos={userVideos}  channelId={userData._id} />
    </div>
  )
}

export default Playlist

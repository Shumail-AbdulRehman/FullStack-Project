import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import VideoCard from '../VideoCard';
import LoadingSpinner from '../LoadingSpinner';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Upload, Plus } from 'lucide-react';

function Videos({ channelId }) {
  const userData = useSelector((state) => state.auth.userData);
  const {
    data: userVideos = [],
    isLoading: fetchingUserVideos,
    isError: fetchingUserVideosError,
    refetch: refetchUserVideos,
  } = useQuery({
    queryKey: ['channelVideos', channelId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/videos/c/${channelId}`,
        { withCredentials: true }
      );
      console.log('res ijdj is ::::=>', res.data.data);
      return res.data.data;
    },
  });
  console.log('chnanel vidoes api response is :::', userVideos);
  
  if (fetchingUserVideos) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }
  
  if (userVideos.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
        <Upload size={80} className="mb-4 text-gray-600" />
        <h1 className="text-2xl font-semibold mb-2">No videos found</h1>
        {userData && userData._id === channelId && (
          <Link 
            to="/video/upload-video"
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <Plus size={20} />
            Upload Your First Video
          </Link>
        )}
      </div>
    );
  } else {
    return (
      <div className="relative">
        <div className='flex gap-2 flex-wrap'>
          {userVideos.map((video) => (
            <Link key={video._id} to={`/video/${video._id}/${video.owner._id}`}>
              <VideoCard {...video} />
            </Link>
          ))}
        </div>
        
        {userData && userData._id === channelId && (
          <Link 
            to="/video/upload-video"
            className="fixed bottom-8 right-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2 z-50"
          >
            <Upload size={20} />
            Upload Video
          </Link>
        )}
      </div>
    );
  }
}

export default Videos;
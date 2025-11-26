import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import VideoCard from '../VideoCard';
import LoadingSpinner from '../LoadingSpinner';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
      <div>
        <h1>No videos found</h1>

        {userData &&
          (userData._id === channelId ? (
            <Link to="/video/upload-video">Upload Video!</Link>
          ) : null)}
      </div>
    );
  } else {
    return (
      <div className="flex w-auto h-auto">
        <div>
          {userVideos.map((video) => (
            <Link key={video._id} to={`/video/${video._id}/${video.owner._id}`}>
              <VideoCard {...video} />
            </Link>
          ))}
        </div>

        {userData &&
          (userData._id === channelId ? (
            <div className="h-auto w-auto bg-amber-200">
              <Link to="/video/upload-video">Upload Video!</Link>
            </div>
          ) : null)}
      </div>
    );
  }
}

export default Videos;

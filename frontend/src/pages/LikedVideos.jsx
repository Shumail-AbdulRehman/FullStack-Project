import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import VideoCard from '@/components/custom/VideoCard';
import SideBar from '@/components/custom/SideBar';
import { Link } from 'react-router-dom';
import LoadingSpinner from '@/components/custom/LoadingSpinner';

function LikedVideos() {
  const userData = useSelector((state) => state.auth.userData);

  const { data: getUserLikedVideos,isPending:likeVideosPending } = useQuery({
    queryKey: ['likedVideos', userData?._id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8000/api/v1/likes/videos`, {
        withCredentials: true,
      });
      console.log('liked videos are ::', res.data.data);
      return res.data.data;
    },
  });

  if(likeVideosPending)
  {
    return <LoadingSpinner/>
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <aside className="w-75 flex-shrink-0 border-r border-gray-800">
        <SideBar />
      </aside>

      <main className="flex-1 px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Liked Videos</h1>
            <p className="text-gray-400">
              Videos you’ve Liked will appear here.
            </p>
          </div>
        </div>

        {getUserLikedVideos && getUserLikedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getUserLikedVideos.map((item) => (
              <Link to={`/video/${item.video._id}/${item._id}`}>
                <VideoCard key={item._id} {...item.video} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mt-10 text-center">
            You havent Liked any video.
          </p>
        )}
      </main>
    </div>
  );
}

export default LikedVideos;

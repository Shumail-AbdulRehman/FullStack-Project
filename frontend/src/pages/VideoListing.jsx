import VideoCard from '@/components/custom/VideoCard';
import { getVideos } from '@/store/videoSlice';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingSpinner from '@/components/custom/LoadingSpinner';
import SideBar from '@/components/custom/SideBar';
import { Link } from 'react-router-dom';

function VideoListing() {
  const videos = useSelector((state) => state.videos.allVideos);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const fetchVideos = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/videos/`,
          { withCredentials: true }
        );
        dispatch(getVideos(fetchVideos.data.data.docs));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (videos.length === 0)
    return <h1 className="bg-black text-white p-6">No videos to show</h1>;

  return (
   
    <div className="flex w-full min-h-screen bg-zinc-950">
      
      <div className="pointer-events-none absolute inset-0 z-0 h-full overflow-hidden">
        <div className="absolute -top-48 left-1/3 h-[700px] w-[700px]
                        rounded-full bg-zinc-950 blur-[160px]" />
        <div className="absolute bottom-[-300px] right-1/4 h-[600px] w-[600px]
                        rounded-full bg-purple-500/10 blur-[180px]" />
      </div>

      
      <aside className="hidden md:block w-60  sticky top-0 h-screen z-20">
        <SideBar />
      </aside>

      
      <main className="flex-1 px-4 py-6 z-10">
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-3
          gap-x-4 gap-y-8
        ">
          {videos.map((video) => (
            <Link
              key={video._id}
              to={`/video/${video._id}/${video.owner._id}`}
              className="block"
            >
              <VideoCard {...video} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default VideoListing;
import VideoCard from '@/components/custom/VideoCard';
import { getVideos } from '@/store/videoSlice';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import LoadingSpinner from '@/components/custom/LoadingSpinner';
import SideBar from '@/components/custom/SideBar';
import { Link } from 'react-router-dom';

function VideoListing() {
  const videos = useSelector((state) => state.videos.allVideos);
  const [channelId, setChannelId] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // console.log("checking ::::",videos[])

  useEffect(() => {
    setLoading(true);
    if (videos.length !== 0) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true)
        const fetchVideos = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/videos/`,
          { withCredentials: true }
        );
        console.log('Whole fetched videos', fetchVideos.data.data);
        console.log(fetchVideos.data.data.docs);
        dispatch(getVideos(fetchVideos.data.data.docs));
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false)
      }
    })();
    setLoading(false);
  }, [videos]);

  if (videos) {
    // setChannelId(videos.owner._id);
  }

  if (loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  } else if (videos.length == 0) {
    return <h1 className="bg-white text-black">no videos to show</h1>;
  } else if (videos.length > 0) {
    return (
      <div className="grid grid-cols-7 min-h-screen m-0 p-0">
        <div className="col-span-1 m-0 p-0">
          <SideBar />
        </div>

        <div className="col-span-6 bg-zinc-950 flex flex-wrap gap-3 p-4 pl-20">
          {videos?.map((video) => (
            <Link key={video._id} to={`/video/${video._id}/${video.owner._id}`}>
              <VideoCard key={video._id} {...video} />
            </Link>
          ))}
        </div>
      </div>
    );
  }
}

export default VideoListing;

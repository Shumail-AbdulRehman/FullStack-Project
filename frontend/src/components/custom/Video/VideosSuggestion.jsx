import React, { useEffect, useState } from 'react';
// import VideoCard from '../VideoCard';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getVideos } from '@/store/videoSlice';
import HorizontalVideoCard from '../HorizontalVideoCard';
function VideosSuggestion() {
  const videos = useSelector((state) => state.videos.allVideos);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  console.log(videos);
  useEffect(() => {
    if (videos.length !== 0) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const fetchVideos = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/videos/`,
          { withCredentials: true }
        );
        console.log('Whole fetched videos', fetchVideos.data.data);
        console.log(fetchVideos.data.data.docs);
        dispatch(getVideos(fetchVideos.data.data.docs));
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
      finally{
        setLoading(false)
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col  justify-center items-center  ">
        <p className="text-white text-lg font-bold mt-40 text-center p-4">Recommended videos ...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full flex-col ">
      {videos?.map((video) => (
        <Link to={`/video/${video._id}/${video.owner._id}`} key={video._id}>
          <HorizontalVideoCard {...video} />
        </Link>
      ))}
    </div>
  );
}

export default VideosSuggestion;

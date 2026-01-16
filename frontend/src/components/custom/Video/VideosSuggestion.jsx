import React, { useEffect, useState } from 'react';
import VideoCard from '../VideoCard';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

function VideosSuggestion() {
  const videos = useSelector((state) => state.videos.allVideos);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  console.log(videos);
  useEffect(() => {
    setLoading(true);
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
      } catch (error) {
        console.log(error);
      }
    })();
    setLoading(false);
  }, [videos]);

  return (
    <div className="flex flex-col border-2 border-black">
      {videos?.map((video) => (
        <Link to={`/video/${video._id}/${video.owner._id}`}>
          <VideoCard key={video._id} {...video} />
        </Link>
      ))}
    </div>
  );
}

export default VideosSuggestion;

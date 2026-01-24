import React, { useState } from 'react';
// import { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
// import { getVideos } from '@/store/videoSlice';
import HorizontalVideoCard from '../HorizontalVideoCard';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

function VideosSuggestion() {
  // const videos = useSelector((state) => state.videos.allVideos);
  // const [loading, setLoading] = useState(true);
  // const dispatch = useDispatch();
  // const currentVideoId=videoId?.video;

  // useEffect(() => {
  //   if (videos.length !== 0) {
  //     setLoading(false);
  //     return;
  //   }
  //   (async () => {
  //     try {
  //       const fetchVideos = await axios.get(
  //         `${import.meta.env.VITE_API_URL}/api/v1/videos/`,
  //         { withCredentials: true }
  //       );

  //       dispatch(getVideos(fetchVideos.data.data.docs));
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);

    // console.log("video Id",videoId);

    const {videoId}=useParams();

        // console.log("video Id",videoId);
  const currentVideoId=videoId;

  const {data:recommendedVideos,isLoading}=useQuery({
    queryKey:["recommended-videos",videoId],
    queryFn:async()=>
    {
      const fetchedRecommendedVideos=await axios.get(`http://localhost:8000/api/v1/videos/recommended-videos/${currentVideoId}`,{withCredentials:true});
      console.log("recommended Videos are::",fetchedRecommendedVideos.data.data.docs);
      return fetchedRecommendedVideos.data.data.docs;
    },
  })


  if (isLoading) {
    return (

      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-3 animate-pulse">
          <Sparkles className="w-6 h-6 text-violet-400" />
        </div>
        <p className="text-zinc-400 text-sm">Loading recommendations...</p>
      </div>
    );
  }

  return (

    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 px-2 mb-3">
        <Sparkles className="w-4 h-4 text-violet-400" />
        <span className="text-sm font-medium text-white">Up next</span>
      </div>

      {recommendedVideos?.map((video, index) => (
        <motion.div
          key={video._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link to={`/video/${video._id}/${video.owner._id}`}>
            <HorizontalVideoCard {...video} />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export default VideosSuggestion;

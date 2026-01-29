  // 1. Correct Import
  import { useInView } from 'react-intersection-observer'; 
  import React, { useEffect } from 'react';
  import { Link, useParams } from 'react-router-dom';
  import axios from 'axios';
  import HorizontalVideoCard from '../HorizontalVideoCard';
  import { motion } from 'framer-motion';
  import { Sparkles } from 'lucide-react';
  import { useInfiniteQuery } from '@tanstack/react-query';

  const fetchRecommendedVideos = async ({ queryKey, pageParam = 1 }) => {
      const [_, videoId] = queryKey; 
      
      const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/videos/recommended-videos/${videoId}?page=${pageParam}&limit=10`, 
          { withCredentials: true }
      );


      console.log("suggested vidoes are::",res.data.data);

      
      return res.data.data; 
  };

  function VideosSuggestion({ videoId: propVideoId }) {
    const { videoId: paramVideoId } = useParams();
    const currentVideoId = propVideoId || paramVideoId;


    console.log("current videoId is::",currentVideoId);

    const { ref, inView } = useInView();

    const {
      data,
      hasNextPage,
      isFetchingNextPage,
      status,
      fetchNextPage
    } = useInfiniteQuery({
      queryKey: ["recommended-videos", currentVideoId], 
      queryFn: fetchRecommendedVideos,
      getNextPageParam: (lastPage) => {
        return lastPage.hasNextPage ? lastPage.nextPage : undefined;
      },
      enabled: !!currentVideoId, 
    });

    useEffect(() => {
      if (inView && hasNextPage) {
        fetchNextPage();
      }
    }, [inView, hasNextPage, fetchNextPage]);


    // console.log("data pages are::",data?.pages);

    const recommendedVideos = data?.pages.flatMap((page) => page.docs) || [];

    if (status === 'pending') {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-3 animate-pulse">
            <Sparkles className="w-6 h-6 text-violet-400" />
          </div>
          <p className="text-zinc-400 text-sm">Loading recommendations...</p>
        </div>
      );
    }

    if (status === 'error') return <p className="text-red-500 text-sm text-center">Failed to load</p>;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 px-2 mb-3">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-white">Up next</span>
        </div>

        {recommendedVideos.map((video, index) => (
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

        {hasNextPage && (
          <div ref={ref} className="w-full flex justify-center py-4">
            {isFetchingNextPage && (
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
        )}
      </div>
    );
  }

  export default VideosSuggestion;
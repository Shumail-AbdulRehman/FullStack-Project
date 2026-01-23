import React from 'react';
import PostTweetCard from './PostTweetCard';
import { useSelector } from 'react-redux';
import TweetCard from './TweetCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';
<<<<<<< HEAD
=======
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
>>>>>>> 4d1eafa (impoved frontend UI)

function Tweets({ channelId }) {
  const userData = useSelector((state) => state.auth.userData);

  const {
    data: tweetData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tweets', channelId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/tweets/user/${channelId}`,
        { withCredentials: true }
      );
<<<<<<< HEAD
      console.log("tweets are::",res.data.data);
=======
>>>>>>> 4d1eafa (impoved frontend UI)
      return res.data.data;
    },
    enabled: !!channelId,
    staleTime: 1000 * 60,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
<<<<<<< HEAD
      <div className="text-center text-red-500 text-lg py-10 bg-[#0f0f0f] w-full">
        Failed to load posts.
=======
      <div className="flex flex-col items-center justify-center py-20 bg-[#050508] text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-red-400">Failed to load posts.</p>
>>>>>>> 4d1eafa (impoved frontend UI)
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="bg-[#0f0f0f] w-full flex justify-center">
=======
    <div className="bg-[#050508] w-full flex justify-center min-h-[400px]">
>>>>>>> 4d1eafa (impoved frontend UI)
      <div className="w-full max-w-[850px] p-4">
        {userData?._id === channelId && <PostTweetCard channelId={channelId} />}

        <div className="w-full mt-4">
          {tweetData.length > 0 ? (
<<<<<<< HEAD
            tweetData.map((tweet) => <TweetCard key={tweet._id} {...tweet} />)
          ) : (
            <div className="text-center text-zinc-500 text-sm py-10">
              This channel hasn't posted any updates yet.
            </div>
=======
            tweetData.map((tweet, index) => (
              <motion.div
                key={tweet._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TweetCard {...tweet} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-zinc-600" />
              </div>
              <p className="text-zinc-500">This channel hasn't posted any updates yet.</p>
            </motion.div>
>>>>>>> 4d1eafa (impoved frontend UI)
          )}
        </div>
      </div>
    </div>
  );
}

export default Tweets;

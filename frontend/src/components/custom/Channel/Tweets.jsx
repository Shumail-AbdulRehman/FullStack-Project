import React from 'react';
import PostTweetCard from './PostTweetCard';
import { useSelector } from 'react-redux';
import TweetCard from './TweetCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';

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
      <div className="text-center text-red-500 text-lg py-10 bg-[#0f0f0f] w-full">
        Failed to load posts.
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f0f] w-full flex justify-center">
      <div className="w-full max-w-[850px] p-4">
        
        {userData?._id === channelId && <PostTweetCard channelId={channelId} />}

        <div className="w-full mt-4">
          {tweetData.length > 0 ? (
            tweetData.map((tweet) => <TweetCard key={tweet._id} {...tweet} />)
          ) : (
            <div className="text-center text-zinc-500 text-sm py-10">
              This channel hasn't posted any updates yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tweets;
import React from 'react';
import PostTweetCard from './PostTweetCard';
import { useSelector } from 'react-redux';
import TweetCard from './TweetCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
      console.log('tweet data is :::', res.data.data);
      return res.data.data;
    },
    enabled: !!channelId,
    staleTime: 1000 * 60,
  });

  if (isLoading) {
    return (
      <div className="text-center text-gray-400 text-lg py-10 bg-black min-h-screen">
        Loading tweets...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 text-lg py-10 bg-black min-h-screen">
        Failed to load tweets.
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen w-full">
      <div className="w-full border-b border-zinc-800">
        {userData?._id === channelId && <PostTweetCard channelId={channelId} />}
      </div>

      <div className="w-full">
        {tweetData.length > 0 ? (
          tweetData.map((tweet) => <TweetCard key={tweet._id} {...tweet} />)
        ) : (
          <div className="text-center text-gray-500 text-lg py-10">
            No Tweets found!
          </div>
        )}
      </div>
    </div>
  );
}

export default Tweets;

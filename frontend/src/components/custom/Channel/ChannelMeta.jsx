import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function ChannelMeta({ channelId }) {
  const queryClient = useQueryClient();

  const { data: channelData, isLoading } = useQuery({
    queryKey: ["channelData", channelId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/users/channel-profile/${channelId}`,
        { withCredentials: true }
      );
      return res.data.data;
    },
    enabled: !!channelId,
  });

  const { mutate: subscriptionMutate } = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/subscriptions/c/${channelId}`,
        {},
        { withCredentials: true }
      );

      console.log("subscription::",res.data.data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["channelData", channelId]);
    },
  });

  const toggleSubscription = () => {
    subscriptionMutate();
  };

  if (isLoading)
    return <p className="text-center py-10 text-gray-500">Loading channel info...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-40 w-full bg-gray-200">
        {channelData?.coverImage ? (
          <img src={channelData.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
            No Cover Image
          </div>
        )}

        <div className="absolute -bottom-12 left-6">
          <img
            src={channelData?.avatar || 'https://via.placeholder.com/100'}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      <div className="mt-16 px-6 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{channelData?.username}</h1>
          <p className="text-gray-500 mt-1">
            Subscribers: <span className="font-medium">{channelData?.subscribersCount}</span>
          </p>
          <p className="text-gray-500 mt-1">
            Subscribed To: <span className="font-medium">{channelData?.channelSubscribedTo}</span>
          </p>
        </div>

        <div className="mt-4 sm:mt-0">
          <button
            onClick={toggleSubscription}
            className={
              channelData?.isSubscribed
                ? "bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-300 transition"
                : "bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition"
            }
          >
            {channelData?.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChannelMeta;

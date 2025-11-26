import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function ChannelMeta({ channelId }) {
  const queryClient = useQueryClient();

  const { data: channelData, isLoading } = useQuery({
    queryKey: ['channelData', channelId],
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
      console.log('subscription::', res.data.data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['channelData', channelId]);
    },
  });

  console.log('channelData is::', channelData);

  const toggleSubscription = () => {
    subscriptionMutate();
  };

  if (isLoading)
    return (
      <p className="text-center py-10 text-gray-400">Loading channel info...</p>
    );

  return (
    <div className="w-full bg-black">
      <div className="relative h-48 w-full bg-zinc-900">
        {channelData?.coverImage ? (
          <img
            src={channelData.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-gray-500">
            No Cover Image
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-start gap-6 -mt-12 pb-6">
          <div className="relative">
            <img
              src={channelData?.avatar || 'https://via.placeholder.com/100'}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-black object-cover"
            />
          </div>

          <div className="flex-1 pt-16">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-white">
                  {channelData?.username}
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  @{channelData?.username?.toLowerCase()}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {channelData?.subscribersCount || 0} Subscribers •{' '}
                  {channelData?.channelSubscribedTo || 0} Subscribed
                </p>
              </div>

              <button
                onClick={toggleSubscription}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                  channelData?.isSubscribed
                    ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {channelData?.isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChannelMeta;

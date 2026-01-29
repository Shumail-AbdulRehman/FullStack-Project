import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

function ChannelMeta({ channelId }) {
  const queryClient = useQueryClient();

  const { data: channelData, isLoading } = useQuery({
    queryKey: ['channelData', channelId],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/api/v1/users/channel-profile/${channelId}`,
        { withCredentials: true }
      );
      return res.data.data;
    },
    enabled: !!channelId,
  });

  const { mutate: subscriptionMutate } = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${API_URL}/api/v1/subscriptions/c/${channelId}`,
        {},
        { withCredentials: true }
      );

      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['channelData', channelId]);
    },
  });


  const toggleSubscription = () => {
    subscriptionMutate();
  };


  if (isLoading) {
    return (
      <div className="w-full bg-[#050508]">
        <div className="h-48 bg-zinc-900 animate-pulse" />
        <div className="max-w-6xl mx-auto px-4 lg:px-6 -mt-16 pb-6">
          <div className="flex items-end gap-4">
            <div className="w-32 h-32 rounded-full bg-zinc-800 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#050508]">
      <div className="relative h-40 lg:h-56 w-full overflow-hidden">
        {channelData?.coverImage ? (
          <img
            src={channelData.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (

          <div className="w-full h-full bg-gradient-to-br from-violet-900/30 to-purple-900/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 pb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <img
              src={channelData?.avatar || 'https://via.placeholder.com/100'}
              alt="Avatar"
              className="w-28 h-28 lg:w-36 lg:h-36 rounded-full border-4 border-[#050508] object-cover shadow-2xl"
            />
          </motion.div>

          <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pt-4 sm:pt-0 text-center sm:text-left w-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                {channelData?.username}
              </h1>
              <p className="text-zinc-400 mt-1">
                @{channelData?.username?.toLowerCase()}
              </p>
              <p className="text-zinc-500 text-sm mt-2">
                <span className="text-white font-medium">{channelData?.subscribersCount || 0}</span> Subscribers
                <span className="mx-2">•</span>
                <span className="text-white font-medium">{channelData?.channelSubscribedTo || 0}</span> Subscribed
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSubscription}
              className={`
                px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300
                ${channelData?.isSubscribed
                  ? 'bg-white/10 text-white border border-white/10 hover:bg-white/15'
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40'
                }
              `}
            >
              <span className="flex items-center gap-2">
                {channelData?.isSubscribed && <Check className="w-4 h-4" />}
                {channelData?.isSubscribed ? 'Subscribed' : 'Subscribe'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChannelMeta;

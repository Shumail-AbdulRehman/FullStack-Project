
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

function PostTweetCard({ channelId }) {
  const queryClient = useQueryClient();
  const userData = useSelector((state) => state.auth.userData);

  const [isFocused, setIsFocused] = useState(false);

  const { mutate: tweetMutate, isPending } = useMutation({
    mutationFn: async (content) => {
      const res = await axios.post(
        `${API_URL}/api/v1/tweets/${channelId}`,
        { content },
        { withCredentials: true }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tweets', channelId]);
    },
    onError: (error) => {

    },
  });

  const { handleSubmit, register, reset, watch } = useForm();
  const contentValue = watch('content');

  const onSubmit = (data) => {
    tweetMutate(data.content);
    reset();

    setIsFocused(false);
  };

  const handleCancel = () => {
    reset();
    setIsFocused(false);
  };

  return (
    <div className="w-full glass-card rounded-2xl p-5 mb-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-white/5">
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (

              <div className="w-full h-full flex items-center justify-center text-zinc-500 font-semibold text-sm">
                {userData?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">

          <div className="relative mb-3">
            <textarea
              {...register('content', { required: true })}
              placeholder="Post an update to your fans..."
              rows={isFocused ? 3 : 2}
              onFocus={() => setIsFocused(true)}
              className={`
                w-full bg-transparent text-white text-sm
                placeholder:text-zinc-500 resize-none outline-none
                border-b-2 transition-all duration-300 pb-2
                ${isFocused ? 'border-violet-500' : 'border-white/10 hover:border-white/20'}
              `}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isFocused ? 1 : 0 }}
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 origin-left"
            />
          </div>

          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-end gap-2"
            >
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"

                disabled={!contentValue || isPending}
                className={`
                  flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${contentValue
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40'
                    : 'bg-white/5 text-zinc-500 cursor-not-allowed'
                  }
                `}
              >
                <Send className="w-4 h-4" />
                Post
              </button>
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
}

export default PostTweetCard;

<<<<<<< HEAD
import React from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 4d1eafa (impoved frontend UI)
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
<<<<<<< HEAD
=======
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
>>>>>>> 4d1eafa (impoved frontend UI)

function PostTweetCard({ channelId }) {
  const queryClient = useQueryClient();
  const userData = useSelector((state) => state.auth.userData);
<<<<<<< HEAD

  const { mutate: tweetMutate } = useMutation({
=======
  const [isFocused, setIsFocused] = useState(false);

  const { mutate: tweetMutate, isPending } = useMutation({
>>>>>>> 4d1eafa (impoved frontend UI)
    mutationFn: async (content) => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/tweets/${channelId}`,
        { content },
        { withCredentials: true }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tweets', channelId]);
    },
    onError: (error) => {
<<<<<<< HEAD
      console.log('Error while tweeting:', error.response?.data?.message);
=======
>>>>>>> 4d1eafa (impoved frontend UI)
    },
  });

  const { handleSubmit, register, reset, watch } = useForm();
  const contentValue = watch('content');

  const onSubmit = (data) => {
    tweetMutate(data.content);
    reset();
<<<<<<< HEAD
  };

  return (
    <div className="w-full bg-[#0f0f0f] border border-zinc-800 rounded-xl p-4 mb-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
<<<<<<< HEAD
              <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold">
=======
              <div className="w-full h-full flex items-center justify-center text-zinc-500 font-semibold text-sm">
>>>>>>> 4d1eafa (impoved frontend UI)
                {userData?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
<<<<<<< HEAD
          <div className="relative mb-2">
            <textarea
              {...register('content', { required: true })}
              placeholder="Post an update to your fans..."
              rows={2}
              className="w-full bg-transparent text-white text-base placeholder-zinc-500 resize-none outline-none border-b border-zinc-700 focus:border-blue-500 focus:border-b-2 transition-all p-2"
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
<<<<<<< HEAD
          </div>

          <div
            className={`flex items-center justify-between transition-all duration-200 ${contentValue ? 'opacity-100' : 'opacity-100'}`}
          >
            {/* <button type="button" className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
               <ImageIcon size={20} />
            </button> */}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 rounded-full transition-colors"
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
              >
                Cancel
              </button>
              <button
                type="submit"
<<<<<<< HEAD
                disabled={!contentValue}
                className="px-5 py-2 bg-[#3ea6ff] hover:bg-[#65b8ff] disabled:bg-zinc-700 disabled:text-zinc-500 text-black text-sm font-semibold rounded-full transition-colors"
              >
                Post
              </button>
            </div>
          </div>
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
        </div>
      </form>
    </div>
  );
}

export default PostTweetCard;

import axios from 'axios';
<<<<<<< HEAD
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function AddComment({ videoId }) {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
=======
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Send, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginPromptModal from '../LoginPromptModal';

function AddComment({ videoId }) {
  const { register, handleSubmit, reset, watch } = useForm();
  const [isFocused, setIsFocused] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const queryClient = useQueryClient();
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const commentValue = watch('comment', '');

  const isLoggedIn = !!userData;

  const { mutate, isPending } = useMutation({
>>>>>>> 4d1eafa (impoved frontend UI)
    mutationFn: async (newComment) => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/comments/${videoId}`,
        { content: newComment },
        { withCredentials: true }
      );
<<<<<<< HEAD

      console.log('new commnet is::', res.data.data);
      return res.data.data;
    },
    onSuccess: (newComment) => {
      queryClient.invalidateQueries(['comment', videoId]);
=======
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comment', videoId]);
      reset();
      setIsFocused(false);
>>>>>>> 4d1eafa (impoved frontend UI)
    },
  });

  const onSubmit = (data) => {
<<<<<<< HEAD
    mutate(data.comment);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 w-full py-4"
    >
      <h2 className="text-xl font-bold text-white mb-2">Add a Comment</h2>
      <div className="relative w-full">
        <textarea
          {...register('comment', { required: true })}
          placeholder="Add a comment..."
          rows="2"
          className="w-full bg-transparent text-white text-[14px] border-b border-zinc-700 focus:border-white focus:border-b-2 outline-none pb-2 resize-none placeholder-zinc-400 transition-all duration-200"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-full transition-colors duration-200"
        >
          Comment
        </button>
=======
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    if (data.comment.trim()) {
      mutate(data.comment);
    }
  };

  const handleCancel = () => {
    reset();
    setIsFocused(false);
  };

  const handleFocus = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    setIsFocused(true);
  };

  if (!isLoggedIn) {
    return (
      <>
        <div
          onClick={() => setShowLoginPrompt(true)}
          className="flex gap-3 w-full cursor-pointer group"
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-white/5 flex items-center justify-center">
              <LogIn className="w-5 h-5 text-zinc-500" />
            </div>
          </div>
          <div className="flex-1">
            <div className="relative py-3 px-4 bg-white/5 rounded-xl border border-white/10 group-hover:border-violet-500/50 group-hover:bg-white/10 transition-all">
              <span className="text-zinc-500 text-sm">Sign in to add a comment...</span>
            </div>
          </div>
        </div>
        <LoginPromptModal
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          action="comment on this video"
        />
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 w-full">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-white/5">
          {userData?.avatar ? (
            <img
              src={userData.avatar}
              alt={userData.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm font-medium">
              {userData?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="relative">
          <textarea
            {...register('comment', { required: true })}
            placeholder="Add a comment..."
            rows={isFocused ? 3 : 1}
            onFocus={handleFocus}
            className={`
              w-full bg-transparent text-white text-sm
              border-b-2 transition-all duration-300 resize-none
              placeholder:text-zinc-500 focus:outline-none
              ${isFocused
                ? 'border-violet-500 pb-2'
                : 'border-white/10 hover:border-white/20'
              }
            `}
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
            className="flex justify-end gap-2 mt-3"
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
              disabled={!commentValue.trim() || isPending}
              className={`
                flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${commentValue.trim()
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40'
                  : 'bg-white/5 text-zinc-500 cursor-not-allowed'
                }
              `}
            >
              <Send className="w-4 h-4" />
              Comment
            </button>
          </motion.div>
        )}
>>>>>>> 4d1eafa (impoved frontend UI)
      </div>
    </form>
  );
}

export default AddComment;
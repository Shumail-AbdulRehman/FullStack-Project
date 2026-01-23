import React, { useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';

import { ThumbsUp, Eye, Check } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import LoginPromptModal from '../LoginPromptModal';

function VideoMeta({
  isSubscribed,
  isLiked,
  owner,
  title,
  views,
  _id,
  description,
}) {

  const userData = useSelector((state) => state.auth.userData);
  const isLoggedIn = !!userData;

  const [subscribed, setSubscribed] = useState(isSubscribed);
  const [liked, setLiked] = useState(isLiked);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [subscribeAnimating, setSubscribeAnimating] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [loginPromptAction, setLoginPromptAction] = useState(null);

  const videoId = _id;
  const channelId = owner?._id;
  const queryClient = useQueryClient();

  const { data: subscribers = 0, isLoading: loadingSubscribers } = useQuery({
    queryKey: ['subscriber', channelId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/subscriptions/c/${channelId}`,
        { withCredentials: true }
      );
      return res.data.data.length;
    },
  });

  const { data: likes = 0, isLoading: loadingLikes } = useQuery({
    queryKey: ['likes', videoId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/likes/v/${videoId}`,
        { withCredentials: true }
      );
      return res.data.data;
    },
  });

  const { mutate: likeMutate } = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/likes/toggle/v/${videoId}`,
        {},
        { withCredentials: true }
      );
      return res.data.data;
    },

    onSuccess: () => queryClient.invalidateQueries(['likes', videoId]),
  });

  const handleLikeClick = () => {
    if (!isLoggedIn) {
      setLoginPromptAction('like this video');
      return;
    }
    setLiked((prev) => !prev);
    setLikeAnimating(true);
    likeMutate();
    setTimeout(() => setLikeAnimating(false), 300);
  };

  const { mutate: subscriberMutate } = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/subscriptions/c/${channelId}`,
        {},
        { withCredentials: true }
      );
      return res.data.data;
    },

    onSuccess: () => queryClient.invalidateQueries(['subscriber', channelId]),
  });

  const handleSubscriberClick = () => {
    if (!isLoggedIn) {
      setLoginPromptAction('subscribe to this channel');
      return;
    }
    setSubscribed((prev) => !prev);
    setSubscribeAnimating(true);
    subscriberMutate();
    setTimeout(() => setSubscribeAnimating(false), 300);
  };


  if (loadingLikes || loadingSubscribers) return <LoadingSpinner fullScreen={false} size="small" />;

  return (
    <>
      <LoginPromptModal
        isOpen={!!loginPromptAction}
        onClose={() => setLoginPromptAction(null)}
        action={loginPromptAction || ''}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <h1 className="text-xl lg:text-2xl font-bold text-white mb-4 leading-tight">
          {title}
        </h1>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <Link to={`/channel/${owner._id}`} className="group flex items-center gap-3">
              <div className="relative">
                <img
                  src={owner.avatar || '/default-avatar.png'}
                  alt={owner.username}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-transparent group-hover:ring-violet-500/50 transition-all duration-300"
                />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors">
                  {owner.fullName}
                </h3>
                <p className="text-xs text-zinc-400">
                  {subscribers.toLocaleString()} subscribers
                </p>
              </div>
            </Link>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSubscriberClick}
              className={`
                px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
                ${subscribed
                  ? 'bg-white/10 text-white border border-white/10 hover:bg-white/15'
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40'
                }
                ${subscribeAnimating ? 'scale-95' : ''}
              `}
            >
              <span className="flex items-center gap-2">
                {subscribed && <Check className="w-4 h-4" />}
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </span>
            </motion.button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-sm">
              <Eye className="w-4 h-4" />
              <span className="font-medium">{views?.toLocaleString()}</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLikeClick}
              className={`
                group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border
                ${liked
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 border-pink-500/50 text-white shadow-lg shadow-pink-500/20'
                  : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                }
              `}
            >
              <ThumbsUp
                className={`w-4 h-4 transition-all duration-300 
                  ${liked ? 'fill-current' : 'group-hover:-rotate-12'}
                  ${likeAnimating ? 'scale-125' : ''}
                `}
              />
              <span className="font-medium text-sm">
                {likes.toLocaleString()}
              </span>
            </motion.button>
          </div>
        </div>

        <motion.div
          onClick={() => setExpanded(!expanded)}
          className="glass-card rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold text-white">{views?.toLocaleString()} views</span>
            <span className="text-zinc-500 text-sm">•</span>
            <span className="text-sm text-zinc-400">Description</span>
          </div>
          <p className={`text-sm text-zinc-300 leading-relaxed whitespace-pre-line ${expanded ? '' : 'line-clamp-2'}`}>
            {description}
          </p>
          {description && description.length > 150 && (
            <button className="text-sm text-violet-400 hover:text-violet-300 mt-2 font-medium">
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}

export default VideoMeta;
import React, { useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';
import { ThumbsUp, Eye, Check } from 'lucide-react'; 
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

function VideoMeta({
  isSubscribed,
  isLiked,
  owner,
  title,
  views,
  _id,
  description,
}) {
  const [subscribed, setSubscribed] = useState(isSubscribed);
  const [liked, setLiked] = useState(isLiked);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [subscribeAnimating, setSubscribeAnimating] = useState(false);

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
    onSuccess: () => {
      queryClient.invalidateQueries(['likes', videoId]);
    },
  });

  const handleLikeClick = () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries(['subscriber', channelId]);
    },
  });

  const handleSubscriberClick = () => {
    setSubscribed((prev) => !prev);
    setSubscribeAnimating(true);
    subscriberMutate();
    setTimeout(() => setSubscribeAnimating(false), 300);
  };

  if (loadingLikes || loadingSubscribers) return <LoadingSpinner />;

  return (
    <div className="w-full max-w-6xl ">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-tight tracking-tight">
        {title}
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6">
        
        <div className="flex items-center justify-between sm:justify-start gap-5 w-full sm:w-auto">
          <Link to={`/channel/${owner._id}`} className="group flex items-center gap-3">
            <div className="relative">
              <img
                src={owner.avatar || '/default-avatar.png'}
                alt={owner.username}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-transparent group-hover:border-purple-500 transition-all duration-300"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-base sm:text-lg text-white group-hover:text-purple-400 transition-colors">
                {owner.fullName}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                {subscribers.toLocaleString()} subscribers
              </p>
            </div>
          </Link>

          <button
            onClick={handleSubscriberClick}
            className={`
              ml-2 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform
              ${
                subscribed
                  ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700'
                  : 'bg-white text-black hover:bg-zinc-200 hover:scale-105 shadow-lg shadow-white/10'
              }
              ${subscribeAnimating ? 'scale-95 ring-2 ring-purple-500/50' : ''}
            `}
          >
            <span className="flex items-center gap-2">
              {subscribed && <Check className="w-4 h-4" />}
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 text-sm">
            <Eye className="w-5 h-5" />
            <span className="font-medium">{views?.toLocaleString()}</span>
          </div>

          <button
            onClick={handleLikeClick}
            className={`
              group relative flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 border
              ${
                liked
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-200 hover:bg-zinc-800'
              }
            `}
          >
            <ThumbsUp
              className={`w-5 h-5 transition-transform duration-300 
                ${liked ? 'fill-red-400 scale-110' : 'group-hover:-rotate-12'}
                ${likeAnimating ? 'animate-bounce' : ''}
              `}
            />
            <span className="font-medium">
                {liked ? 'Liked' : 'Like'} &nbsp; | &nbsp; {likes}
            </span>
          </button>
        </div>
      </div>

      <div className="w-full bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors rounded-xl p-4 cursor-pointer group">
        <div className="flex gap-2 mb-2">
            <span className="text-sm font-semibold text-white">Description</span>
        </div>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
}

export default VideoMeta;
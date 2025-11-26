import React, { useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';
import { ThumbsUp, Eye } from 'lucide-react';
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
    <div className="w-full bg-[#0f0f0f] text-white rounded-xl mt-6 p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 leading-snug">
        {title}
      </h2>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#272727] pb-4 mb-4">
        <Link to={`/channel/${owner._id}`} className="flex items-center gap-3">
          <img
            src={owner.avatar || '/default-avatar.png'}
            alt={owner.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-white">{owner.fullName}</h3>
            <p className="text-sm text-gray-400">
              {subscribers.toLocaleString()} subscribers
            </p>
          </div>
        </Link>

        <button
          onClick={handleSubscriberClick}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 
            ${subscribed ? 'bg-gray-300 text-black scale-105' : 'bg-white text-black'} 
            ${subscribeAnimating ? 'animate-pulse' : ''} hover:scale-105`}
        >
          {subscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-300" />
            <span>{views?.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsUp
              onClick={handleLikeClick}
              className={`w-5 h-5 cursor-pointer transition-transform duration-200 
                ${liked ? 'text-blue-400 scale-125' : 'text-gray-300 scale-100'} 
                ${likeAnimating ? 'animate-pulse' : ''} hover:scale-110`}
            />
            <span>{likes}</span>
          </div>
        </div>
      </div>

      <p className="text-sm sm:text-base text-gray-200 leading-relaxed whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}

export default VideoMeta;

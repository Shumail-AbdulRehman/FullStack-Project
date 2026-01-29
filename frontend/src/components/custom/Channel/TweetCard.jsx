import React, { useState } from 'react';

import { ThumbsUp, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1)
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}

function TweetCard({
  content,
  owner,
  createdAt,
  likeCount = 0,
  commentsCount = 0,
  _id,
  isLiked,
}) {
  const [likingTweet, setLikingTweet] = useState(isLiked);
  const userData = useSelector((state) => state.auth.userData);
  const queryClient = useQueryClient();
  const channelId = owner?._id;

  const likeTweet = async (tweetId) => {
    try {
      await axios.post(
        `${API_URL}/api/v1/likes/toggle/t/${tweetId}`,
        {},
        { withCredentials: true }
      );
      setLikingTweet((prev) => !prev);
      queryClient.invalidateQueries(['tweets', channelId]);
    } catch (error) {

    }
  };

  const deleteTweet = async (tweetId) => {
    try {
      await axios.delete(`${API_URL}/api/v1/tweets/${tweetId}`, {
        withCredentials: true,
      });
      queryClient.invalidateQueries(['tweets', channelId]);
    } catch (error) {

    }
  };

  return (

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 mb-4 group hover:bg-white/10 transition-all duration-300"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-transparent group-hover:ring-violet-500/30 transition-all cursor-pointer">
            {owner?.avatar ? (
              <img
                src={owner.avatar}
                alt={owner.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                {owner?.username?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm hover:text-violet-400 cursor-pointer transition-colors">
                {owner?.fullName || owner?.username || 'Channel Name'}
              </span>
              <span className="text-zinc-500 text-xs">
                • {createdAt ? timeAgo(createdAt) : 'Just now'}
              </span>
            </div>

            {userData?._id === owner?._id && (

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteTweet(_id)}
                className="opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400"
                title="Delete Post"
              >
                <Trash2 size={16} />
              </motion.button>
            )}
          </div>

          <p className="text-white text-[15px] leading-relaxed whitespace-pre-wrap mb-4">
            {content}
          </p>

          <div className="flex items-center gap-1">

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => likeTweet(_id)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200
                ${likingTweet
                  ? 'bg-pink-500/20 text-pink-400'
                  : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                }
              `}
            >
              <ThumbsUp
                size={16}
                className={likingTweet ? 'fill-current' : ''}
              />
              <span className="text-sm font-medium">{likeCount}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TweetCard;

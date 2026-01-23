import React, { useState } from 'react';
<<<<<<< HEAD
import { ThumbsUp, MessageSquare, MoreVertical, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
=======
import { ThumbsUp, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
>>>>>>> 4d1eafa (impoved frontend UI)

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
        `http://localhost:8000/api/v1/likes/toggle/t/${tweetId}`,
        {},
        { withCredentials: true }
      );
      setLikingTweet((prev) => !prev);
      queryClient.invalidateQueries(['tweets', channelId]);
    } catch (error) {
<<<<<<< HEAD
      console.log('error ::', error);
=======
>>>>>>> 4d1eafa (impoved frontend UI)
    }
  };

  const deleteTweet = async (tweetId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/tweets/${tweetId}`, {
        withCredentials: true,
      });
      queryClient.invalidateQueries(['tweets', channelId]);
    } catch (error) {
<<<<<<< HEAD
      console.log('error is::', error);
=======
>>>>>>> 4d1eafa (impoved frontend UI)
    }
  };

  return (
<<<<<<< HEAD
    <div className="bg-[#0f0f0f] border border-zinc-800 rounded-xl p-4 mb-4 hover:border-zinc-700 transition-colors group">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden cursor-pointer">
=======
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 mb-4 group hover:bg-white/10 transition-all duration-300"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-transparent group-hover:ring-violet-500/30 transition-all cursor-pointer">
>>>>>>> 4d1eafa (impoved frontend UI)
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
<<<<<<< HEAD
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm hover:text-gray-300 cursor-pointer">
                {owner?.fullName || owner?.username || 'Channel Name'}
              </span>
              <span className="text-zinc-500 text-xs">
                {createdAt ? timeAgo(createdAt) : 'Just now'}
=======
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm hover:text-violet-400 cursor-pointer transition-colors">
                {owner?.fullName || owner?.username || 'Channel Name'}
              </span>
              <span className="text-zinc-500 text-xs">
                • {createdAt ? timeAgo(createdAt) : 'Just now'}
>>>>>>> 4d1eafa (impoved frontend UI)
              </span>
            </div>

            {userData?._id === owner?._id && (
<<<<<<< HEAD
              <button
                onClick={() => deleteTweet(_id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-red-500"
                title="Delete Post"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <p className="text-white text-[15px] leading-6 whitespace-pre-wrap mb-3">
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
            {content}
          </p>

          <div className="flex items-center gap-1">
<<<<<<< HEAD
            <div className="flex items-center">
              <button
                onClick={() => likeTweet(_id)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-zinc-800 transition-colors"
              >
                <ThumbsUp
                  size={18}
                  className={
                    likingTweet ? 'fill-white text-white' : 'text-zinc-400'
                  }
                />
                <span
                  className={`text-sm ${likingTweet ? 'text-white' : 'text-zinc-400'}`}
                >
                  {likeCount}
                </span>
              </button>
            </div>

            {/* <button className="flex items-center gap-2 p-2 rounded-full hover:bg-zinc-800 transition-colors ml-2">
              <MessageSquare size={18} className="text-zinc-400" />
              <span className="text-sm text-zinc-400">{commentsCount}</span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
  );
}

export default TweetCard;

import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, MoreVertical, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

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
      console.log('error ::', error);
    }
  };

  const deleteTweet = async (tweetId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/tweets/${tweetId}`, {
        withCredentials: true,
      });
      queryClient.invalidateQueries(['tweets', channelId]);
    } catch (error) {
      console.log('error is::', error);
    }
  };

  return (
    <div className="bg-[#0f0f0f] border border-zinc-800 rounded-xl p-4 mb-4 hover:border-zinc-700 transition-colors group">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden cursor-pointer">
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
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm hover:text-gray-300 cursor-pointer">
                {owner?.fullName || owner?.username || 'Channel Name'}
              </span>
              <span className="text-zinc-500 text-xs">
                {createdAt ? timeAgo(createdAt) : 'Just now'}
              </span>
            </div>

            {userData?._id === owner?._id && (
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
            {content}
          </p>

          <div className="flex items-center gap-1">
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
  );
}

export default TweetCard;

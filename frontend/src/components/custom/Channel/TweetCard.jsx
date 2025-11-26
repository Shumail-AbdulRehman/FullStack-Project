import React, { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";

function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}

function TweetCard({ content, owner, createdAt, likesCount = 425, commentsCount = 87 }) {
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <div className="bg-black border-b w-full border-zinc-800 p-4 hover:bg-zinc-950 transition-colors">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
            {owner?.avatar ? (
              <img 
                src={owner.avatar} 
                alt={owner.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {owner?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-bold text-sm">
              {owner?.fullName || owner?.username || 'React Patterns'}
            </span>
            <span className="text-gray-500 text-xs">
              {createdAt ? timeAgo(createdAt) : 'Just now'}
            </span>
          </div>

          <p className="text-gray-200 text-xl leading-relaxed mb-3">
            {content}
          </p>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center gap-1 hover:text-pink-500 transition-colors group p-1"
            >
              <Heart 
                size={16} 
                className={`group-hover:fill-pink-500 ${isLiked ? 'fill-pink-500 text-pink-500' : 'text-gray-500'}`}
              />
              <span className="text-xs text-gray-500">{likesCount}</span>
            </button>
            
            <button className="flex items-center gap-1 hover:text-blue-400 transition-colors p-1 ml-3">
              <MessageCircle size={16} className="text-gray-500" />
              <span className="text-xs text-gray-500">{commentsCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TweetCard;

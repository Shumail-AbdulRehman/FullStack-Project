import React from 'react';
<<<<<<< HEAD
=======
import { motion } from 'framer-motion';
>>>>>>> 4d1eafa (impoved frontend UI)

function formatDuration(duration) {
  if (!duration) return '00:00';
  const totalSeconds = Math.floor(duration);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function timeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return 'Just now';

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

export default function HorizontalVideoCard({
  title,
  views,
  thumbnail,
  duration,
  createdAt,
  owner,
}) {
  return (
<<<<<<< HEAD
    <div className="flex gap-3 p-2 rounded-xl cursor-pointer hover:bg-zinc-800/50 transition-colors duration-200 w-full group">
      
      <div className="relative w-40 sm:w-55 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-zinc-900">
=======
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="group flex gap-3 p-2 rounded-xl cursor-pointer hover:bg-white/5 transition-all duration-300 w-full"
    >
      {/* Thumbnail */}
      <div className="relative w-40 sm:w-44 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-zinc-900">
>>>>>>> 4d1eafa (impoved frontend UI)
        <img
          src={thumbnail}
          alt={title}
          loading='lazy'
<<<<<<< HEAD
          className="w-full  h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {duration && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-sm font-medium px-1.5 py-0.5 rounded text-white">
            {formatDuration(duration)}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0 pr-2"> 
        <h3 className="text-md font-medium text-white leading-tight line-clamp-2 mb-1 group-hover:text-gray-300 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-gray-200 hover:text-white transition-colors mb-0.5">
          {owner?.username ?? 'Unknown Channel'}
        </p>

        <p className="text-sm text-gray-200">
          {views ? views.toLocaleString() : 0} views • {timeAgo(createdAt)}
        </p>
      </div>
    </div>
=======
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Duration Badge */}
        {duration && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-xs font-medium px-1.5 py-0.5 rounded text-white">
            {formatDuration(duration)}
          </span>
        )}

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-violet-600/90 backdrop-blur-sm flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 pr-2 py-1">
        <h3 className="text-sm font-medium text-white leading-snug line-clamp-2 mb-1.5 group-hover:text-violet-100 transition-colors duration-200">
          {title}
        </h3>

        <p className="text-xs text-zinc-400 hover:text-zinc-300 transition-colors mb-0.5 truncate">
          {owner?.username ?? 'Unknown Channel'}
        </p>

        <p className="text-xs text-zinc-500">
          {views ? views.toLocaleString() : 0} views • {timeAgo(createdAt)}
        </p>
      </div>

      {/* Left border indicator on hover */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-violet-500 to-purple-500 rounded-r group-hover:h-8 transition-all duration-300 opacity-0 group-hover:opacity-100" />
    </motion.div>
>>>>>>> 4d1eafa (impoved frontend UI)
  );
}
import React from 'react';
<<<<<<< HEAD
=======
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
>>>>>>> 4d1eafa (impoved frontend UI)

function formatDuration(duration) {
  if (!duration) return 'N/A';
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

export default function SearchingHorizontalCard({
  title,
  views,
  thumbnail,
  duration,
  createdAt,
  description,
  owner,
}) {
  return (
<<<<<<< HEAD
    <div className="flex gap-6  rounded-xl cursor-pointer bg-zinc-950 hover:bg-zinc-700 transition-colors duration-200 w-full">
      <div className="relative w-135 h-80 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />

        {duration && (
          <span className="absolute bottom-3 right-3 bg-black/80 text-base px-3 py-1.5 rounded text-white">
            {formatDuration(duration)}
          </span>
        )}
      </div>

      <div className="flex flex-col justify-start text-white flex-1">
        <h2 className="text-xl font-bold leading-snug line-clamp-2">
          {title}
        </h2>

        <p className="text-md text-gray-300 mt-2">
          {views ?? 0} views • {timeAgo(createdAt)}
        </p>

        <div className="flex items-center gap-4 mt-4">
          <img
            src={owner?.avatar}
            alt="avatar"
            loading='lazy'

            className="w-12 h-12 rounded-full object-cover"
          />
          <p className="text-lg text-gray-200">
=======
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col sm:flex-row gap-4 lg:gap-6 p-2 rounded-xl cursor-pointer hover:bg-white/5 transition-all duration-300 w-full"
    >
      {/* Thumbnail */}
      <div className="relative w-full sm:w-64 lg:w-80 aspect-video rounded-xl overflow-hidden flex-shrink-0 bg-zinc-900">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Duration Badge */}
        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-md text-white">
            {formatDuration(duration)}
          </span>
        )}

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-violet-600/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-violet-500/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-start flex-1 min-w-0 py-1">
        <h2 className="text-lg lg:text-xl font-semibold text-white leading-snug line-clamp-2 group-hover:text-violet-100 transition-colors">
          {title}
        </h2>

        <p className="text-sm text-zinc-400 mt-2">
          {views ? views.toLocaleString() : 0} views • {timeAgo(createdAt)}
        </p>

        {/* Channel Info */}
        <div className="flex items-center gap-3 mt-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-transparent group-hover:ring-violet-500/30 transition-all">
            {owner?.avatar ? (
              <img
                src={owner.avatar}
                alt={owner.username}
                loading='lazy'
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs font-medium">
                {owner?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <p className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
>>>>>>> 4d1eafa (impoved frontend UI)
            {owner?.username ?? 'Unknown'}
          </p>
        </div>

<<<<<<< HEAD
        {description && (
          <p className="text-lg text-gray-300 mt-4 line-clamp-3">
=======
        {/* Description */}
        {description && (
          <p className="text-sm text-zinc-500 mt-3 line-clamp-2 hidden lg:block">
>>>>>>> 4d1eafa (impoved frontend UI)
            {description}
          </p>
        )}
      </div>
<<<<<<< HEAD
    </div>
=======
    </motion.div>
>>>>>>> 4d1eafa (impoved frontend UI)
  );
}
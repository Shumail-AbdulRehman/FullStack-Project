import React from 'react';
<<<<<<< HEAD
=======
import { motion } from 'framer-motion';
>>>>>>> 4d1eafa (impoved frontend UI)

function formatDuration(duration) {
  if (!duration) return '0:00';
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

function VideoCard({
  title,
  views,
  thumbnail,
  duration,
  createdAt,
  owner,
}) {
  return (
<<<<<<< HEAD
    <div className="bg-zinc-950 text-white rounded-xl overflow-hidden hover:bg-zinc-800 transition-colors">
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-sm px-1.5 py-0.5 rounded">
          {formatDuration(duration)}
        </span>
      </div>

      <div className="flex gap-3 mt-3 px-1">
        <div className="w-13 mt-4 h-13 rounded-full bg-zinc-700 overflow-hidden shrink-0">
          {owner?.avatar && (
            <img
              src={owner.avatar}
              alt={owner.username}
              loading='lazy'
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg mt-4 font-medium leading-snug line-clamp-2">
            {title}
          </h2>
          <p className="text-lg text-zinc-300 mt-1">
            {owner?.username}
          </p>
          <p className="text-lg text-zinc-300">
            {views ?? 0} views • {timeAgo(createdAt)}
          </p>
        </div>
      </div>
    </div>
=======
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group relative rounded-xl overflow-hidden bg-transparent cursor-pointer"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-xs font-medium text-white">
          {formatDuration(duration)}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-violet-600/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-violet-500/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <svg
              className="w-6 h-6 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-3 px-1">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-transparent group-hover:ring-violet-500/50 transition-all duration-300">
            {owner?.avatar ? (
              <img
                src={owner.avatar}
                alt={owner.username}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm font-medium">
                {owner?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0a0a0f] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-medium text-white leading-snug line-clamp-2 group-hover:text-violet-100 transition-colors duration-200">
            {title}
          </h3>
          <div className="mt-1 flex flex-col gap-0.5">
            <p className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors truncate">
              {owner?.username}
            </p>
            <p className="text-sm text-zinc-500">
              <span>{views ?? 0} views</span>
              <span className="mx-1">•</span>
              <span>{timeAgo(createdAt)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full bg-violet-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
>>>>>>> 4d1eafa (impoved frontend UI)
  );
}

export default VideoCard;

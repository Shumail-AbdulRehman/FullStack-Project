import React from 'react';

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
    <div className="flex gap-3 p-2 rounded-xl cursor-pointer hover:bg-zinc-800/50 transition-colors duration-200 w-full group">
      
      <div className="relative w-40 sm:w-55 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-zinc-900">
        <img
          src={thumbnail}
          alt={title}
          loading='lazy'
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
  );
}
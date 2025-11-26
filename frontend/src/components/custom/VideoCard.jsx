import React from 'react';

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

function VideoCard({
  title,
  views,
  videoFile,
  thumbnail,
  duration,
  createdAt,
  owner,
}) {
  return (
    <div className="bg-zinc-900 text-white w-full max-w-[420px] cursor-pointer rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors duration-200">
      <div className="relative">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title || 'thumbnail'}
            className="w-full h-60 object-cover"
          />
        )}
        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-sm font-medium px-2 py-1 rounded">
            {formatDuration(duration)}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden shrink-0">
            {owner?.avatar ? (
              <img
                src={owner.avatar}
                alt={owner.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-white font-semibold">
                {owner?.username?.[0]?.toUpperCase() ?? 'U'}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-base leading-snug line-clamp-2 text-gray-100 mb-1.5">
              {title}
            </h2>
            <p className="text-sm text-gray-400">
              {owner?.username ?? 'Unknown'}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              {views ?? 0} views • {timeAgo(createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;

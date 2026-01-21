import React from 'react';

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
  );
}

export default VideoCard;

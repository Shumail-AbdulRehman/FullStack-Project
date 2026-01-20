import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Clock, User } from 'lucide-react';

export default function NotificationList({
  notifications = [],
  onNotificationClick,
}) {
  if (notifications.length === 0) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center bg-[#1F1F1F] rounded-xl border border-zinc-800">
        <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
          <Bell size={32} className="text-zinc-500" />
        </div>
        <h3 className="text-white text-lg font-semibold mb-2">
          Your notifications live here
        </h3>
        <p className="text-[#AAAAAA] text-sm max-w-xs text-center">
          Subscribe to your favorite channels to get notified about their latest videos.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[600px] overflow-y-auto bg-[#1F1F1F] rounded-xl border border-zinc-800 custom-scrollbar shadow-2xl">
      <div className="py-2">
        {notifications.map((notification, idx) => {
          const username = notification.video?.owner?.username || 'Channel';
          const title = notification.video?.title || 'New video uploaded';
          const videoId = notification.video?._id;
          const ownerId = notification.video?.owner?._id;
          const avatar = notification.video?.owner?.avatar;
          const thumbnail = notification.video?.thumbnail;
          const createdAt = notification.video?.createdAt;

          return (
            <Link
              key={idx}
              to={`/video/${videoId}/${ownerId}`}
              className="block"
              onClick={onNotificationClick}
            >
              <div className="group flex gap-4 p-4 transition-colors duration-200 hover:bg-[#272727] cursor-pointer">
                <div className="flex-shrink-0 relative">
                  <div className="w-12 h-12 rounded-full bg-[#121212] overflow-hidden border border-zinc-800">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                        <User size={20} className="text-zinc-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-sm text-white leading-snug line-clamp-2">
                    <span className="font-semibold text-white group-hover:text-[#3EA6FF] transition-colors">
                      {username}
                    </span>
                    <span className="text-zinc-300"> uploaded: </span>
                    <span>{title}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="text-xs text-[#AAAAAA] font-medium">
                      {timeAgo(createdAt)}
                    </span>
                  </div>
                </div>

                {thumbnail && (
                  <div className="flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-black/20 border border-zinc-800">
                    <img
                      src={thumbnail}
                      alt="thumbnail"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function timeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'week', secs: 604800 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 },
  ];

  for (let interval of intervals) {
    const value = Math.floor(seconds / interval.secs);
    if (value >= 1) {
      return `${value} ${interval.label}${value > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}
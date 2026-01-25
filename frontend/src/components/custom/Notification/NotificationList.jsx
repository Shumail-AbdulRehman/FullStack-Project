import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Play, Loader2, AlertCircle } from 'lucide-react'; // Added AlertCircle
import { motion } from 'framer-motion';

export default function NotificationList({
  notifications = [],
  onNotificationClick,
  lastElementRef,      
  isFetchingNextPage,  
  hasNextPage,         
  isLoading,
  isError
}) {

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-2" />
        <p className="text-zinc-500 text-sm">Loading updates...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-zinc-400 text-sm">Failed to load notifications.</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mb-4">
          <Bell className="w-7 h-7 text-zinc-600" />
        </div>
        <h3 className="text-white font-medium mb-1">No notifications yet</h3>
        <p className="text-zinc-500 text-sm max-w-[200px]">
          Subscribe to channels to get notified about new videos
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full"> 
      {notifications.map((notification, idx) => {
        const username = notification.video?.owner?.username || 'Channel';
        const title = notification.video?.title || 'New video uploaded';
        const videoId = notification.video?._id;
        const ownerId = notification.video?.owner?._id;
        const avatar = notification.video?.owner?.avatar;
        const thumbnail = notification.video?.thumbnail;
        const createdAt = notification.createdAt; 

        return (
          <motion.div
             // ...
             key={notification._id || idx} 
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: idx * 0.05 }}
          >
            <Link
              to={`/video/${videoId}/${ownerId}`}
              className="block"
              onClick={onNotificationClick}
            >
             <div className="group flex gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
               <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-transparent group-hover:ring-violet-500/30 transition-all">
                    {avatar ? (
                      <img src={avatar} alt={username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-4 h-4 text-zinc-500" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 line-clamp-2 leading-snug">
                    <span className="font-semibold text-white group-hover:text-violet-400 transition-colors">
                      {username}
                    </span>
                    {' '}uploaded:{' '}
                    <span className="text-zinc-300">{title}</span>
                  </p>
                  <span className="text-xs text-zinc-500 mt-1 block">
                    {timeAgo(createdAt)}
                  </span>
                </div>

                {thumbnail && (
                  <div className="flex-shrink-0 relative w-20 h-12 sm:w-24 sm:h-14 rounded-lg overflow-hidden bg-zinc-900">
                    <img src={thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                  </div>
                )}
             </div>
            </Link>
          </motion.div>
        );
      })}

      {hasNextPage && (
        <div ref={lastElementRef} className="w-full py-4 flex justify-center items-center">
          {isFetchingNextPage ? (
             <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
             <span className="text-xs text-zinc-600">Load more</span>
          )}
        </div>
      )}
    </div>
  );
}

// ... timeAgo function ...
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
    if (value >= 1) return `${value} ${interval.label}${value > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}
import React from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { Bell, Clock, User } from 'lucide-react';
=======
import { Bell, User, Play } from 'lucide-react';
import { motion } from 'framer-motion';
>>>>>>> 4d1eafa (impoved frontend UI)

export default function NotificationList({
  notifications = [],
  onNotificationClick,
}) {
  if (notifications.length === 0) {
    return (
<<<<<<< HEAD
      <div className="w-full h-96 flex flex-col items-center justify-center bg-[#1F1F1F] rounded-xl border border-zinc-800">
        <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
          <Bell size={32} className="text-zinc-500" />
        </div>
        <h3 className="text-white text-lg font-semibold mb-2">
          Your notifications live here
        </h3>
        <p className="text-[#AAAAAA] text-sm max-w-xs text-center">
          Subscribe to your favorite channels to get notified about their latest videos.
=======
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mb-4">
          <Bell className="w-7 h-7 text-zinc-600" />
        </div>
        <h3 className="text-white font-medium mb-1">No notifications yet</h3>
        <p className="text-zinc-500 text-sm max-w-[200px]">
          Subscribe to channels to get notified about new videos
>>>>>>> 4d1eafa (impoved frontend UI)
        </p>
      </div>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
      {notifications.map((notification, idx) => {
        const username = notification.video?.owner?.username || 'Channel';
        const title = notification.video?.title || 'New video uploaded';
        const videoId = notification.video?._id;
        const ownerId = notification.video?.owner?._id;
        const avatar = notification.video?.owner?.avatar;
        const thumbnail = notification.video?.thumbnail;
        const createdAt = notification.video?.createdAt;

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link
>>>>>>> 4d1eafa (impoved frontend UI)
              to={`/video/${videoId}/${ownerId}`}
              className="block"
              onClick={onNotificationClick}
            >
<<<<<<< HEAD
              <div className="group flex gap-4 p-4 transition-colors duration-200 hover:bg-[#272727] cursor-pointer">
                <div className="flex-shrink-0 relative">
                  <div className="w-12 h-12 rounded-full bg-[#121212] overflow-hidden border border-zinc-800">
=======
              <div className="group flex gap-3 p-3 hover:bg-white/5 transition-colors">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-transparent group-hover:ring-violet-500/30 transition-all">
>>>>>>> 4d1eafa (impoved frontend UI)
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
<<<<<<< HEAD
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                        <User size={20} className="text-zinc-400" />
=======
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-4 h-4 text-zinc-500" />
>>>>>>> 4d1eafa (impoved frontend UI)
                      </div>
                    )}
                  </div>
                </div>

<<<<<<< HEAD
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
=======
                {/* Content */}
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

                {/* Thumbnail */}
                {thumbnail && (
                  <div className="flex-shrink-0 relative w-24 h-14 rounded-lg overflow-hidden bg-zinc-900">
                    <img
                      src={thumbnail}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                    />
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-3 h-3 text-black fill-black ml-0.5" />
                      </div>
                    </div>
>>>>>>> 4d1eafa (impoved frontend UI)
                  </div>
                )}
              </div>
            </Link>
<<<<<<< HEAD
          );
        })}
      </div>
=======
          </motion.div>
        );
      })}
>>>>>>> 4d1eafa (impoved frontend UI)
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
import React from "react";
import { Link } from "react-router-dom";
import { Bell, Clock, User } from "lucide-react";

export default function NotificationList({ notifications = [], onNotificationClick }) {
  console.log("notifications are:", notifications);
  
  if (notifications.length === 0) {
    return (
      <div className="max-h-96 overflow-y-auto bg-zinc-900 rounded-lg">
        <div className="p-8 text-center flex flex-col items-center justify-center">
          <Bell size={48} className="text-zinc-700 mb-3" />
          <p className="text-zinc-400 text-lg font-medium">No notifications yet</p>
          <p className="text-zinc-600 text-sm mt-1">You'll see notifications here when channels upload new videos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[600px] overflow-y-auto bg-zinc-900 rounded-lg custom-scrollbar">
      {notifications.map((notification, idx) => {
        const username = notification.video?.owner?.username || "A Channel";
        const title = notification.video?.title || "New live stream is now live";
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
            <div className="flex gap-3 items-start p-3 transition-all duration-200 ease-in-out hover:bg-zinc-800 cursor-pointer border-b border-zinc-800 last:border-b-0 group">
              {/* Avatar with Notification Badge */}
              <div className="relative flex-shrink-0">
                <div className="w-15 h-15 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden ring-2 ring-zinc-800 group-hover:ring-blue-500 transition-all">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>
                {/* New Notification Indicator */}
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-zinc-900"></div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-xl text-zinc-300 leading-snug">
                    <span className="font-semibold text-white hover:text-blue-400 transition-colors">
                      {username}
                    </span>{" "}
                    uploaded a new video
                  </p>
                  
                  {/* Time Badge */}
                  <div className="flex items-center gap-1 text-md text-zinc-300 flex-shrink-0">
                    <Clock size={12} />
                    <span>{timeAgo(createdAt)}</span>
                  </div>
                </div>

                {/* Video Title */}
                <h3 className="text-md font-medium text-white line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
                  {title}
                </h3>
              </div>

              {thumbnail && (
                <div className="flex-shrink-0 w-28 h-16 rounded-md overflow-hidden bg-zinc-800 group-hover:ring-2 group-hover:ring-blue-500 transition-all">
                  <img
                    src={thumbnail}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function timeAgo(date) {
  if (!date) return "";
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: "year", secs: 31536000 },
    { label: "month", secs: 2592000 },
    { label: "week", secs: 604800 },
    { label: "day", secs: 86400 },
    { label: "hour", secs: 3600 },
    { label: "minute", secs: 60 }
  ];

  for (let interval of intervals) {
    const value = Math.floor(seconds / interval.secs);
    if (value >= 1) {
      return `${value}${interval.label[0]}`;  // "5h ago" → "5h"
    }
  }
  return "now";
}
import React from "react";

function formatDuration(duration) {
  if (!duration) return "N/A";
  const totalSeconds = Math.floor(duration);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function timeAgo(date) {
  if (!date) return "";
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) return "Just now";

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1)
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  }

  return "Just now";
}

export default function HorizontalVideoCard({
  title,
  views,
  thumbnail,
  duration,
  createdAt,
  description,
  owner,
}) {
  return (
    <div className="flex gap-6 p-6 rounded-xl cursor-pointer bg-zinc-950 hover:bg-zinc-700 transition-colors duration-200 w-full">

      {/* Thumbnail */}
      <div className="relative w-200 h-90 rounded-lg overflow-hidden flex-shrink-0">
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

      {/* Right Side Info */}
      <div className="flex flex-col justify-start text-white flex-1">

        {/* Title */}
        <h2 className="text-2xl font-bold leading-snug line-clamp-2">
          {title}
        </h2>

        {/* Views + Time */}
        <p className="text-lg text-gray-300 mt-2">
          {views ?? 0} views • {timeAgo(createdAt)}
        </p>

        {/* Channel Row */}
        <div className="flex items-center gap-4 mt-4">
          <img
            src={owner?.avatar}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <p className="text-lg text-gray-200">{owner?.username ?? "Unknown"}</p>
        </div>

        {/* Description */}
        {description && (
          <p className="text-lg text-gray-300 mt-4 line-clamp-3">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

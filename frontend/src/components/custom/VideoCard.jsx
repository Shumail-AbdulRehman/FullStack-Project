import React from 'react';

function formatDuration(duration) {
  if (!duration) return "N/A";
  const totalSeconds = Math.floor(duration);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function VideoCard({ title, views, videoFile, thumbnail, duration, createdAt, owner }) {
  return (
    <div className="bg-[#1f1f1f] text-white w-full max-w-[360px] cursor-pointer p-3 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
      
      <div className="relative rounded-xl overflow-hidden">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title || "thumbnail"}
            className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
          />
        )}
        {duration && (
          <span className="absolute bottom-2 right-2 bg-gradient-to-r from-black/70 via-black/50 to-black/70 text-xs font-medium px-2 py-0.5 rounded">
            {formatDuration(duration)}
          </span>
        )}
      </div>

      <div className="flex mt-4">
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden shrink-0">
          {owner?.avatar ? (
            <img
              src={owner.avatar}
              alt={owner.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm text-gray-300 font-semibold">
              {owner?.username?.[0]?.toUpperCase() ?? "U"}
            </span>
          )}
        </div>

        <div className="ml-4 flex flex-col justify-center">
          <h2 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-gray-300">
            {title}
          </h2>
          <p className="text-xs text-gray-400 mt-1">{owner?.username ?? "Unknown"}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {views ?? 0} views • {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

    </div>
  );
}

export default VideoCard;

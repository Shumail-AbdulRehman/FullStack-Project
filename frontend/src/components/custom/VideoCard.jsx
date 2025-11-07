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
    <div className="bg-[#212121] text-white w-full max-w-[360px] cursor-pointer p-2">
      <div className="relative rounded-xl overflow-hidden">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title || "thumbnail"}
            className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
          />
        )}
        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-2 py-0.5 rounded">
            {formatDuration(duration)}
          </span>
        )}
      </div>

      <div className="flex mt-3">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
          {owner?.avatar ? (
            <img
              src={owner.avatar}
              alt={owner.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm text-gray-300">
              {owner?.username?.[0]?.toUpperCase() ?? "U"}
            </span>
          )}
        </div>

        <div className="ml-3 flex flex-col">
          <h2 className="font-semibold text-sm leading-tight line-clamp-2 hover:text-gray-300">
            {title}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{owner?.username ?? "Unknown"}</p>
          <p className="text-xs text-gray-400">
            {views ?? 0} views • {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;

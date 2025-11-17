import React from 'react';

function VideoComment({ content, createdAt, owner, avatar }) {
  return (
    <div className="flex items-start gap-3 p-4 border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200 rounded-lg">
      <img
        src={avatar || "https://ui-avatars.com/api/?rounded=true&size=64"}
        alt={owner}
        className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-semibold text-white text-sm">{owner}</span>
          <span className="text-xs text-gray-400">{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-gray-200 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

export default VideoComment;

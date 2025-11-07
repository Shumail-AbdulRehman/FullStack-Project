import React from 'react'

function VideoComment({content, createdAt, owner, avatar}) {
  return (
<div className="flex items-start gap-3 p-3 border-b border-gray-200">
<img
src={avatar || "https://ui-avatars.com/api/?rounded=true&size=64"}
alt={owner}
className="w-10 h-10 rounded-full object-cover"
/>
<div>
<div className="flex items-center gap-2">
<span className="font-semibold text-white text-sm">{owner}</span>
{/* <span className="text-xs text-gray-500">{new Date(createdAt).toLocaleDateString()}</span> */}
</div>
<p className="text-sm text-white mt-1">{content}</p>
</div>
</div>
);
}

export default VideoComment

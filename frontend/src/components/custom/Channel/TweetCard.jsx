import React from "react";

function TweetCard({ content }) {
  return (
    <div className="max-w-md mx-auto border border-gray-200 rounded-xl p-5 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col gap-3">
        
        <p className="text-gray-800 text-base leading-relaxed">{content}</p>

        <div className="flex items-center justify-between text-gray-400 text-sm mt-2">
          {/* <span className="hover:text-blue-500 cursor-pointer transition-colors">Reply</span> */}
          <span className="hover:text-red-500 cursor-pointer transition-colors">Like</span>
          {/* <span className="hover:text-green-500 cursor-pointer transition-colors">Share</span> */}
        </div>
      </div>
    </div>
  );
}

export default TweetCard;

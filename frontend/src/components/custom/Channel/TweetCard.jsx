import React from "react";

function TweetCard({ content }) {
  return (
    <div className="max-w-md mx-auto border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start gap-3">
        
        <div className="flex-1">
          {/* <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">Shumail</span>
            <span className="text-gray-500 text-sm">@shumail123</span>
          </div> */}

          <p className="mt-1 text-gray-800">{content}</p>

          {/* Bottom actions (like, reply, share) */}
         
        </div>
      </div>
    </div>
  );
}

export default TweetCard;

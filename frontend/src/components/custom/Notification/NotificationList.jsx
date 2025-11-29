import React from "react";

export default function NotificationList({ notifications = [] }) {
  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No notifications</div>
      ) : (
        notifications.map((n, idx) => (
          <div
            key={idx}
            className="flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer"
          >
            {n.video?.thumbnail && (
              <img
                src={n.video.thumbnail}
                alt="thumb"
                className="w-12 h-12 rounded object-cover"
              />
            )}
            <div className="flex flex-col text-sm">
              <span className="font-medium">{n.video?.title || "New video"}</span>
              <span className="text-gray-500">{n.video?.owner?.username || ""}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

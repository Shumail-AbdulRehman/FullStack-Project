import React from "react";

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function NotificationItem({ notification, onMarkRead = () => {}, onClick = () => {} }) {
  const { message, createdAt, read, type, data } = notification;

  return (
    <div
      className={`flex gap-3 p-3 hover:bg-white/3 transition items-start ${read ? "opacity-80" : "bg-white/2"}`}
      onClick={() => {
        if (!read) onMarkRead(notification);
        onClick(notification);
      }}
    >
      <div className="w-12 h-12 rounded-lg bg-gray-900 flex-shrink-0 overflow-hidden flex items-center justify-center">
        <div className="text-white text-sm font-semibold">{(type || "").slice(0,2).toUpperCase()}</div>
      </div>

      <div className="flex-1 text-card-foreground">
        <div className="text-sm">
          <span className="block">{message}</span>
        </div>
        <div className="text-xs text-muted mt-1">{timeAgo(createdAt)}</div>
      </div>

      {!read && (
        <div className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
        </div>
      )}
    </div>
  );
}

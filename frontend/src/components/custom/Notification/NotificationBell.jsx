import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell } from "lucide-react";
import NotificationList from "./NotificationList";

function useOutsideAlerter(ref, onOutside) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutside();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, onOutside]);
}

export default function NotificationBell({ notifications = [] }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setOpen(false));

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div ref={wrapperRef} className="relative">
      {/* Bell */}
      <button
        onClick={() => setOpen((s) => !s)}
        className="relative p-2 rounded-full  hover:bg-gray-700 transition"
        aria-label="Notifications"
      >
        <Bell className="w-7 h-7 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 w-3 h-3 rounded-full" />
        )}
      </button>

      {/* Dropdown Portal */}
      {open &&
        createPortal(
          <div
            className="absolute right-0 mt-2 w-fit h-auto bg-zinc-800  rounded shadow-lg z-[1000]"
            style={{
              top: wrapperRef.current?.getBoundingClientRect().bottom + window.scrollY,
              left:
                wrapperRef.current?.getBoundingClientRect().right - 320, // width 80 * 4
            }}
          >
            <NotificationList notifications={notifications} />
          </div>,
          document.body
        )}
    </div>
  );
}

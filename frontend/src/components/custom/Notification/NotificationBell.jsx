import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell } from "lucide-react";
import NotificationList from "./NotificationList";

// Updated Hook: Accepts both refs (wrapperRef and dropdownRef)
function useOutsideAlerter(wrapperRef, dropdownRef, onOutside) {
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if the click is OUTSIDE the bell wrapper AND OUTSIDE the dropdown
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        onOutside();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef, dropdownRef, onOutside]);
}

export default function NotificationBell({ notifications = [] }) {
  const [open, setOpen] = useState(false);
  
  const wrapperRef = useRef(null);
  
  const dropdownRef = useRef(null);

  useOutsideAlerter(wrapperRef, dropdownRef, () => setOpen(false));

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="relative p-2 rounded-full hover:bg-gray-700 transition"
        aria-label="Notifications"
      >
        <Bell className="w-7 h-7 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 w-3 h-3 rounded-full" />
        )}
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef} 
            className="absolute right-0 mt-2 w-fit h-auto bg-zinc-800 rounded shadow-lg z-[1000]"
            style={{
              top: (wrapperRef.current?.getBoundingClientRect().bottom || 0) + window.scrollY,
              left: (wrapperRef.current?.getBoundingClientRect().right || 0) - 320, 
            }}
          >
            <NotificationList 
              notifications={notifications} 
              onNotificationClick={() => setOpen(false)} 
            />
          </div>,
          document.body
        )}
    </div>
  );
}
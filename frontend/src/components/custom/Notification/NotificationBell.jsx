import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, LogIn } from 'lucide-react'; // Added LogIn icon for the empty state
import NotificationList from './NotificationList';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Assuming you use react-router for links

function useOutsideAlerter(wrapperRef, dropdownRef, onOutside) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        onOutside();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef, dropdownRef, onOutside]);
}

export default function NotificationBell({ notifications = [] }) {
  const [open, setOpen] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
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
        {/* Only show badge if user is logged in AND has unread items */}
        {userData && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 w-3 h-3 rounded-full" />
        )}
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            // Changed w-fit to w-80 for better consistency when showing the login message
            className="absolute right-0 mt-2 w-80 h-auto bg-[#282828] rounded-xl shadow-xl border border-white/10 overflow-hidden z-[1000]"
            style={{
              top:
                (wrapperRef.current?.getBoundingClientRect().bottom || 0) +
                window.scrollY,
              left:
                (wrapperRef.current?.getBoundingClientRect().right || 0) - 320,
            }}
          >
            {!userData ? (
              <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
                <div className="p-3 bg-zinc-800 rounded-full">
                  <Bell className="w-8 h-8 text-zinc-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">Notifications</h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Please log in to view your notifications.
                  </p>
                </div>
                <Link 
                  to="/login" 
                  onClick={() => setOpen(false)}
                  className="mt-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-full transition-colors"
                >
                  Log In
                </Link>
              </div>
            ) : (
              <NotificationList
                notifications={notifications}
                onNotificationClick={() => setOpen(false)}
              />
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
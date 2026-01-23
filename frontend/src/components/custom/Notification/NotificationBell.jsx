import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
<<<<<<< HEAD
import { Bell, LogIn } from 'lucide-react'; // Added LogIn icon for the empty state
import NotificationList from './NotificationList';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Assuming you use react-router for links
=======
import { Bell } from 'lucide-react';
import NotificationList from './NotificationList';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
>>>>>>> 4d1eafa (impoved frontend UI)

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
<<<<<<< HEAD
=======
  const [position, setPosition] = useState({ top: 0, left: 0 });
>>>>>>> 4d1eafa (impoved frontend UI)
  const userData = useSelector((state) => state.auth.userData);
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);

  useOutsideAlerter(wrapperRef, dropdownRef, () => setOpen(false));

  const unreadCount = notifications.filter((n) => !n.read).length;

<<<<<<< HEAD
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
=======
  // Update position when opening
  useEffect(() => {
    if (open && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: Math.max(rect.right - 320, 16),
      });
    }
  }, [open]);

  const DropdownContent = () => (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed w-80 rounded-2xl shadow-2xl overflow-hidden z-[9999]"
      style={{
        top: position.top,
        left: position.left,
        background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(10, 10, 18, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-violet-400" />
          Notifications
        </h3>
      </div>

      {!userData ? (
        <div className="flex flex-col items-center justify-center p-8 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
            <Bell className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <p className="text-zinc-400 text-sm">
              Sign in to view your notifications
            </p>
          </div>
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-violet-500/25 transition-all"
          >
            Sign In
          </Link>
        </div>
      ) : (
        <NotificationList
          notifications={notifications}
          onNotificationClick={() => setOpen(false)}
        />
      )}
    </motion.div>
  );

  return (
    <div ref={wrapperRef} className="relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((s) => !s)}
        className="relative p-2 rounded-xl hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell className={`w-5 h-5 transition-colors ${open ? 'text-violet-400' : 'text-zinc-400 hover:text-white'}`} />

        {/* Notification Badge */}
        {userData && unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center"
          >
            <span className="text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </motion.span>
        )}
      </motion.button>

      {createPortal(
        <AnimatePresence>
          {open && <DropdownContent />}
        </AnimatePresence>,
        document.body
      )}
>>>>>>> 4d1eafa (impoved frontend UI)
    </div>
  );
}
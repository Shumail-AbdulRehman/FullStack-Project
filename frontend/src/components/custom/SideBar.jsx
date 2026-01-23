
import React, { useState } from 'react';
import { Heart, History, Video, Users, Settings, Home, ChevronRight, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import LoginPromptModal from './LoginPromptModal';

function SideBar() {
  const userData = useSelector((state) => state.auth.userData);
  const location = useLocation();

  const [loginPromptAction, setLoginPromptAction] = useState(null);
  const isLoggedIn = !!userData;

  const isActive = (path) => location.pathname === path;

  const mainNavItems = [
    { to: '/', icon: Home, label: 'Home', requiresAuth: false },
    { to: '/user/liked-videos', icon: Heart, label: 'Liked Videos', requiresAuth: true, authAction: 'view liked videos' },
    { to: '/user/watch-history', icon: History, label: 'History', requiresAuth: true, authAction: 'view watch history' },
  ];

  const userNavItems = [
    { to: `/channel/${userData?._id}`, icon: Video, label: 'My Content', requiresAuth: true, authAction: 'view your content' },
    { to: '/user/dashboard', icon: Users, label: 'Dashboard', requiresAuth: true, authAction: 'access dashboard' },
  ];

  const NavLink = ({ to, icon: Icon, label, delay = 0, requiresAuth = false, authAction }) => {
    const active = isActive(to);

    const handleClick = (e) => {
      if (requiresAuth && !isLoggedIn) {
        e.preventDefault();
        setLoginPromptAction(authAction);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay * 0.05, duration: 0.3 }}
      >
        <Link
          to={isLoggedIn || !requiresAuth ? to : '#'}
          onClick={handleClick}
          className={`
            group relative flex items-center gap-4 px-4 py-3 rounded-xl
            transition-all duration-300 ease-out
            ${active
              ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/10 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }
          `}
        >
          {active && (
            <motion.div
              layoutId="sidebar-indicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-violet-500 to-purple-500"
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            />
          )}

          <div className={`
            w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300
            ${active
              ? 'bg-gradient-to-br from-violet-500/20 to-purple-500/20'
              : 'bg-white/5 group-hover:bg-white/10'
            }
          `}>
            <Icon className={`
              w-[18px] h-[18px] transition-all duration-300
              ${active ? 'text-violet-400' : 'text-zinc-400 group-hover:text-white'}
            `} />
          </div>

          <span className={`
            text-[15px] font-medium transition-colors duration-300
            ${active ? 'text-white' : ''}
          `}>
            {label}
          </span>

          <ChevronRight className={`
            w-4 h-4 ml-auto transition-all duration-300 opacity-0 -translate-x-2
            group-hover:opacity-100 group-hover:translate-x-0
            ${active ? 'text-violet-400' : 'text-zinc-500'}
          `} />
        </Link>
      </motion.div>
    );
  };

  return (
    <>
      <LoginPromptModal
        isOpen={!!loginPromptAction}
        onClose={() => setLoginPromptAction(null)}
        action={loginPromptAction || ''}
      />
      <div className="w-64 h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0d0d14] flex flex-col sticky top-0 border-r border-white/5">
        <div className="flex flex-col p-3 space-y-1 pt-4">
          {mainNavItems.map((item, index) => (
            <NavLink key={item.to} {...item} delay={index} />
          ))}
        </div>

        <div className="mx-4 my-2">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="flex flex-col p-3 space-y-1">
          {isLoggedIn ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-2 mb-1"
            >
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                You
                <ChevronRight className="w-3 h-3" />
              </span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-2 mb-1"
            >
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                Account
                <ChevronRight className="w-3 h-3" />
              </span>
            </motion.div>
          )}

          {userNavItems.map((item, index) => (
            <NavLink key={item.to} {...item} delay={index + 3} />
          ))}
        </div>

        <div className="mx-4 my-2">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="flex flex-col p-3 space-y-1">
          <NavLink to="/channel/settings" icon={Settings} label="Settings" delay={5} />
        </div>

        <div className="mt-auto">
          <div className="h-20 bg-gradient-to-t from-violet-500/5 to-transparent pointer-events-none" />
        </div>
      </div>
    </>
  );
}

export default SideBar;
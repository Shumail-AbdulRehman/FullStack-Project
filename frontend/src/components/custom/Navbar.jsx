import React, { useState } from 'react';

import {
  Search,
  Menu,
  X,
  Home,
  Heart,
  History,
  Video,
  Users,
  Settings,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import LogoutBtn from './LogoutBtn';
import NotificationBell from './Notification/NotificationBell';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userData = useSelector((state) => state.auth.userData);

  const [query, setQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setIsMobileSearchOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const isActive = (path) => location.pathname === path;
  const isVideoPage = location.pathname.startsWith('/video/');


  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/videos/get-notifications`,
        { withCredentials: true }
      );
      return res.data.data;
    },
  });


  const sidebarNavItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/user/liked-videos', icon: Heart, label: 'Liked Videos' },
    { to: '/user/watch-history', icon: History, label: 'History' },
    { to: `/channel/${userData?._id}`, icon: Video, label: 'My Content' },
    { to: '/user/dashboard', icon: Users, label: 'Dashboard' },
  ];

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-72 z-[60] bg-[#0d0d14] border-r border-white/5"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.98) 0%, rgba(10, 10, 18, 1) 100%)',
            }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">MyTube</span>
              </div>
              <button
                onClick={closeSidebar}
                className="p-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {isAuthenticated && userData && (
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <img
                    src={userData.avatar || 'https://ui-avatars.com/api/?rounded=true'}
                    alt={userData.username}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/30"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{userData.fullName}</p>
                    <p className="text-zinc-500 text-xs truncate">@{userData.username}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col h-[calc(100%-140px)] overflow-y-auto custom-scrollbar py-4">
              <nav className="space-y-1 px-3">
                {sidebarNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={closeSidebar}
                      className={`
                        relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${active
                          ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-white border border-violet-500/20'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-violet-400' : ''}`} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-white/5 mx-4 my-4" />

              <nav className="space-y-1 px-3">
                <Link
                  to="/channel/settings"
                  onClick={closeSidebar}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive('/channel/settings')
                      ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-white border border-violet-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Settings className={`w-5 h-5 ${isActive('/channel/settings') ? 'text-violet-400' : ''}`} />
                  <span className="font-medium">Settings</span>
                </Link>
              </nav>

              {!isAuthenticated && (
                <div className="mt-auto px-4 pb-4">
                  <Button
                    onClick={() => { navigate('/login'); closeSidebar(); }}
                    className="w-full h-11 rounded-xl font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                  >
                    Sign in
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-40 bg-[#050508]/80 backdrop-blur-xl border-b border-white/5">
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 z-50 bg-[#050508] flex items-center px-2 h-16"
            >
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 rounded-xl hover:bg-white/5 transition-colors text-zinc-400"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 mx-2">
                <input
                  type="text"
                  value={query}
                  placeholder="Search videos..."
                  autoFocus
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-10 px-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 text-sm"
                />
              </div>
              <button
                onClick={handleSearch}
                className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 transition-colors"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 h-14 sm:h-16">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleSidebar}
              className={`
                p-2 sm:p-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 text-zinc-400 hover:text-white
                ${isVideoPage ? '' : 'lg:hidden'}
              `}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:glow transition-all duration-300">
                <svg height="18" viewBox="0 0 24 24" width="18" focusable="false" className="text-white fill-current sm:w-5 sm:h-5">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-bold hidden sm:block">
                <span className="gradient-text">My</span>
                <span className="text-white">Tube</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
            <div className={`
              flex w-full relative rounded-full transition-all duration-300
              ${isSearchFocused ? 'ring-2 ring-violet-500/50 shadow-lg shadow-violet-500/10' : ''}
            `}>
              <input
                type="text"
                value={query}
                placeholder="Search videos..."
                onKeyDown={handleKeyDown}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="
                  w-full h-10 lg:h-11 pl-5 pr-4 rounded-l-full 
                  bg-white/5 border border-white/10 border-r-0
                  text-white placeholder-zinc-500 text-sm
                  focus:outline-none focus:bg-white/10
                  transition-all duration-300
                "
              />
              <button
                onClick={handleSearch}
                className="
                  h-10 lg:h-11 px-4 lg:px-5 flex items-center justify-center rounded-r-full 
                  bg-white/5 border border-white/10 border-l-0
                  hover:bg-violet-500/20 transition-all duration-200
                  group
                "
              >
                <Search className="w-4 h-4 lg:w-5 lg:h-5 text-zinc-400 group-hover:text-violet-400 transition-colors" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden p-2 sm:p-2.5 rounded-xl hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="relative">
              <NotificationBell notifications={notifications || []} />
            </div>

            <div className="hidden sm:block">
              {isAuthenticated ? (
                <LogoutBtn />
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  className="
                    h-9 sm:h-10 px-4 sm:px-5 rounded-full font-medium text-sm
                    bg-gradient-to-r from-violet-600 to-purple-600
                    hover:from-violet-500 hover:to-purple-500
                    text-white shadow-lg shadow-violet-500/25
                    hover:shadow-violet-500/40
                    transition-all duration-300
                  "
                >
                  <span className="hidden sm:inline">Sign in</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              )}
            </div>

            {isAuthenticated && userData && (
              <Link to={`/channel/${userData._id}`} className="sm:hidden">
                <img
                  src={userData.avatar || 'https://ui-avatars.com/api/?rounded=true'}
                  alt={userData.username}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/30"
                />
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import LogoutBtn from './LogoutBtn';
import NotificationBell from './Notification/NotificationBell';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${query}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 h-16 bg-zinc-950 border-b border-zinc-950 sticky top-0 z-50">
      <div
        className="flex items-center gap-1 cursor-pointer group"
        onClick={() => navigate('/')}
      >
        <div className="flex items-center justify-center p-2">
            <svg height="24" viewBox="0 0 24 24" width="24" focusable="false" className="block text-red-600 fill-current pb-1 w-8 h-8">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
            </svg>
            <span className="text-xl tracking-tighter font-bold text-white relative bottom-[1px]">
              MyTube
            </span>
        </div>
      </div>

      <div className="hidden md:flex flex-1 max-w-2xl mx-4 items-center">
        <div className="flex w-full relative">
          <input
            type="text"
            value={query}
            placeholder="Search"
            onKeyDown={handleKeyDown}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-13 pl-4 pr-12 rounded-l-full bg-[#121212] border border-zinc-700 text-base text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 shadow-inner"
          />
          <button 
            onClick={handleSearch}
            className="h-13 w-16 flex items-center justify-center rounded-r-full bg-zinc-800 border border-l-0 border-zinc-700 hover:bg-zinc-700 transition cursor-pointer"
          >
            <Search className="w-5 h-5 text-zinc-300 font-thin" />
          </button>
        </div>
      </div>

      {/* --- Right: Actions --- */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Improved Bell Container */}
        <div className="flex items-center">
            {notifications && (
                <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-800 transition cursor-pointer relative">
                    <NotificationBell notifications={notifications} />
                </div>
            )}
        </div>

        {isAuthenticated ? (
          <LogoutBtn />
        ) : (
          <Button 
            onClick={() => navigate('/login')}
            className="h-9 px-4 flex items-center gap-2 rounded-full border border-zinc-700 hover:bg-[#263850] hover:border-transparent text-blue-400 font-medium bg-transparent transition-all"
          >
            <div className="w-6 h-6 border border-current rounded-full flex items-center justify-center">
                 <span className="text-xs">👤</span> 
            </div>
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
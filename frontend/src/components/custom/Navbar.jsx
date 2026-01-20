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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${query}`);
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
    <header className="flex items-center justify-between px-6 h-20 bg-[#0f0f0f] border-b border-zinc-800 sticky top-0 z-50">
      <div
        className="text-xl font-semibold text-white cursor-pointer flex items-center gap-2"
        onClick={() => navigate('/')}
      >
        MyTube
      </div>

      <div className="flex-1 max-w-2xl mx-8 relative">
        <input
          type="text"
          value={query}
          placeholder="Search"
          onKeyDown={handleKeyDown}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-10 pl-4 pr-12 rounded-full bg-[#121212] border border-zinc-700 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
        />
        <button className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center rounded-r-full bg-zinc-800 hover:bg-zinc-700 transition">
          <Search className="w-5 h-5 text-zinc-300" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {notifications && <NotificationBell notifications={notifications} />}
        {isAuthenticated ? (
          <LogoutBtn />
        ) : (
          <Button className="h-9 px-5 rounded-full bg-red-600 hover:bg-red-700 text-sm font-medium">
            Login
          </Button>
        )}
      </div>
    </header>
  );
}

export default Navbar;

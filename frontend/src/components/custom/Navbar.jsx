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
    const [query, setQuery] = useState("");

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        navigate(`/search?q=${query}`);
      }
    };

    const { data: notifications } = useQuery({
      queryKey: ["notifications"],
      queryFn: async () => {
        const res = await axios.get(
          `http://localhost:8000/api/v1/videos/get-notifications`,
          { withCredentials: true }
        );
        return res.data.data;
      }
    });

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 rounded-lg shadow-md h-25">
        {/* Logo */}
        <div className="text-2xl font-bold cursor-pointer text-white flex-shrink-0">
          MyTube
        </div>

        {/* Search Bar */}
        <div className="relative border-black flex-1 max-w-xl mx-6">
          <input
            type="text"
            value={query}
            placeholder="Search"
            onKeyDown={handleKeyDown}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-600 bg-white text-black font-normal pl-12 pr-4 py-3 rounded-full shadow-sm  outline-none transition"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black w-6 h-6" />
        </div>

        {/* Right Actions: Combined Bell + Auth */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          {notifications && (
          <div className="relative">
    <NotificationBell notifications={notifications} />
  </div>

          )}

          {/* Auth Button */}
          {isAuthenticated ? (
            <button className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition text-white font-medium">
              Logout
            </button>
          ) : (
            <Button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-medium transition">
              Login
            </Button>
          )}
        </div>
      </div>
    );
  }

  export default Navbar;

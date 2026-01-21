import React from 'react';
import { Heart, History, Video, Users, Settings, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function SideBar() {
  const userData = useSelector((state) => state.auth.userData);
  const location = useLocation();

  const getLinkClasses = (path) => {
    const baseClasses = "flex items-center gap-5 px-3 py-2.5 rounded-xl transition-colors duration-200";
    const activeClasses = "bg-[#272727] font-semibold text-white";
    const inactiveClasses = "text-zinc-300 hover:bg-[#272727] hover:text-white";

    return location.pathname === path 
      ? `${baseClasses} ${activeClasses}` 
      : `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <div className="w-64 h-screen bg-zinc-950 flex flex-col sticky top-0  overflow-y-auto">
      
      <div className="flex flex-col p-3 space-y-1">
        <Link to="/" className={getLinkClasses('/')}>
          <Home className="w-5 h-5" />
          <span className="text-lg">Home</span>
        </Link>
        
        <Link to="/user/liked-videos" className={getLinkClasses('/user/liked-videos')}>
          <Heart className="w-5 h-5" />
          <span className="text-lg">Liked Videos</span>
        </Link>
        
        <Link to="/user/watch-history" className={getLinkClasses('/user/watch-history')}>
          <History className="w-5 h-5" />
          <span className="text-lg">History</span>
        </Link>
      </div>

      <div className="border-t border-zinc-800 mx-4 my-2"></div>

      <div className="flex flex-col p-3 space-y-1">
        {userData && (
            <div className="px-3 py-2 mb-1 text-base font-semibold text-white">
                You &gt;
            </div>
        )}
        
        <Link to={`/channel/${userData?._id}`} className={getLinkClasses(`/channel/${userData?._id}`)}>
          <Video className="w-5 h-5" />
          <span className="text-lg">My Content</span>
        </Link>
        
        <Link to="/user/dashboard" className={getLinkClasses('/user/dashboard')}>
          <Users className="w-5 h-5" />
          <span className="text-lg">Dashboard</span>
        </Link>
      </div>

      <div className="border-t border-zinc-800 mx-4 my-2"></div>

      <div className="flex flex-col p-3 space-y-1">
        <Link to="/channel/settings" className={getLinkClasses('/channel/settings')}>
          <Settings className="w-5 h-5" />
          <span className="text-lg">Settings</span>
        </Link>
      </div>

     

    </div>
  );
}

export default SideBar;
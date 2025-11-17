import React from "react";
import {
  Heart,
  History,
  Video,
  Users,
  LifeBuoy,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

function SideBar() {
  return (
    <div className="h-screen w-auto bg-[#212121] text-white flex flex-col ">
      <ul className="space-y-2 text-lg font-medium">
        <Link to="/">
        <li className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#383838] cursor-pointer">
          <span className="font-semibold">Home</span>
        </li>
        </Link>
        <Link to='/user/liked-videos'>
          <li className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-[#383838]">
          <Heart className="w-6 h-6" />
          <span>Liked Videos</span>
        </li>
        </Link>
        
        <Link to="/user/watch-history">
        <li className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-[#383838]">
          <History className="w-6 h-6" />
          <span>History</span>
        </li>
        </Link>
        
        <li className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-[#383838]">
          <Video className="w-6 h-6" />
          <span>My Content</span>
        </li>
        <li className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-[#383838]">
          <Users className="w-6 h-6" />
          <span>Subscribers</span>
        </li>
      </ul>

      <div className="border-t border-gray-700 my-5"></div>

      <ul className="space-y-2 text-lg font-medium">
        
        <Link to="/channel/settings">
        <li className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-[#383838]">
          <Settings className="w-6 h-6" />
          <span>Settings</span>
        </li>
        </Link>
        
      </ul>
    </div>
  );
}

export default SideBar;

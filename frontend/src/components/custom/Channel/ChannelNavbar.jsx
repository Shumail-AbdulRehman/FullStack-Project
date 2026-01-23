<<<<<<< HEAD
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function ChannelNavbar({ setSelectedOption, selectedOption }) {
  const options = ['Videos', 'Playlist', 'Tweets'];
  const userData = useSelector((state) => state.auth.userData);

  return (
    <div className="w-full bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex gap-6  text-gray-200">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedOption(option)}
              className={`py-3 text-xl px-10 font-medium  cursor-pointer transition-colors border-b-2 ${
                selectedOption === option
                  ? 'text-white border-white'
                  : 'border-transparent hover:text-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
=======
import React from 'react';
import { useSelector } from 'react-redux';
import { Video, ListVideo, MessageSquare } from 'lucide-react';

function ChannelNavbar({ setSelectedOption, selectedOption }) {
  const options = [
    { key: 'Videos', label: 'Videos', icon: Video },
    { key: 'Playlist', label: 'Playlists', icon: ListVideo },
    { key: 'Tweets', label: 'Posts', icon: MessageSquare },
  ];
  const userData = useSelector((state) => state.auth.userData);

  return (
    <div className="w-full bg-[#050508] border-b border-white/5 sticky top-14 sm:top-16 z-30">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex overflow-x-auto no-scrollbar">
          {options.map((option) => {
            const Icon = option.icon;
            const isActive = selectedOption === option.key;
            return (
              <button
                key={option.key}
                onClick={() => setSelectedOption(option.key)}
                className={`
                  flex items-center gap-2 py-3 px-4 sm:px-6 lg:px-8 
                  font-medium whitespace-nowrap transition-all duration-200
                  border-b-2 flex-shrink-0
                  ${isActive
                    ? 'text-white border-violet-500'
                    : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-white/5'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : ''}`} />
                <span className="text-sm sm:text-base">{option.label}</span>
              </button>
            );
          })}
>>>>>>> 4d1eafa (impoved frontend UI)
        </div>
      </div>
    </div>
  );
}

export default ChannelNavbar;

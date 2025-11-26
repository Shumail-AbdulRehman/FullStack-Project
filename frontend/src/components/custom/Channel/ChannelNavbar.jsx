import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function ChannelNavbar({ setSelectedOption, selectedOption }) {
  const options = ['Videos', 'Playlist', 'Tweets'];
  const userData = useSelector((state) => state.auth.userData);

  return (
    <div className="w-full bg-black border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex gap-6 text-gray-400">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedOption(option)}
              className={`py-3 text-xl px-10 font-medium  transition-colors border-b-2 ${
                selectedOption === option
                  ? 'text-white border-white'
                  : 'border-transparent hover:text-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChannelNavbar;

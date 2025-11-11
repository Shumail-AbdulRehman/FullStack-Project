import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function ChannelNavbar({setSelectedOption,selectedOption}) {
  const options = ["Videos", "Playlist", "Tweets"];
  const userData=useSelector((state)=> state.auth.userData);

  return (
    <div className="w-full bg-black text-white py-2 flex justify-center gap-3">
      {options.map((option) => (
        <Button
          key={option}
          onClick={() => setSelectedOption(option)}
          variant={selectedOption === option ? "default" : "secondary"}
          className={`text-sm md:text-base px-4 py-2 rounded-md transition-all duration-200 ${
            selectedOption === option
              ? "bg-indigo-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {option}


        </Button>

        
      ))}

      <Link to={`/channel/${userData?._id}`}>

      <div className='text-red h-auto w-auto text-xl bg-black'>
        My channel
      </div>
      </Link>
    </div>
  );
}

export default ChannelNavbar;

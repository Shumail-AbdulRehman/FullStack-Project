import { Button } from '@/components/ui/button';
import React from 'react'

function SettingNavbar({ setSelectedOption, selectedOption }) {
  const options = ["Personal Information", "Channel Information", "Change Password"];

  return (
    <div className="flex gap-3">
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
    </div>
  );
}

export default SettingNavbar;

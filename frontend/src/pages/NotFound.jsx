import React from 'react';
import { Home, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white p-4">
      <div className="bg-zinc-900 p-6 rounded-full mb-6">
        <AlertTriangle className="w-16 h-16 text-red-500" />
      </div>

      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
        404
      </h1>
      <h2 className="text-xl md:text-2xl font-medium text-zinc-300 mb-2 text-center">
        Page Not Found
      </h2>
      <p className="text-zinc-500 text-center max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <Link to="/">
        <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-all duration-200">
          <Home className="w-5 h-5" />
          Back to Home
        </button>
      </Link>
    </div>
  );
}

export default NotFound;
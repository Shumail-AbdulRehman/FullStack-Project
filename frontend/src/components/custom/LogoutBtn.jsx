import React, { useState } from 'react';
import { Button } from '../ui/button';
import LoadingSpinner from './LoadingSpinner';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import axios from 'axios';

import { LogOut } from 'lucide-react';

function LogoutBtn() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    setLoading(true);
    await axios.post(
      'http://localhost:8000/api/v1/users/logout',
      {},
      { withCredentials: true }
    );
    dispatch(logout());
    setLoading(false);
  };

  return (
    <Button
      onClick={handleSubmit}

      variant="outline"
      className="h-9 px-4 rounded-full border-white/10 bg-white/5 text-zinc-300 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all duration-300"
      disabled={loading}
    >
      {loading ? (
        <LoadingSpinner size="small" fullScreen={false} />
      ) : (
        <>
          <LogOut className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </>
      )}
    </Button>
  );
}

export default LogoutBtn;
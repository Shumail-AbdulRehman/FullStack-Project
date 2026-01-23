import React, { useState } from 'react';
import { Button } from '../ui/button';
import LoadingSpinner from './LoadingSpinner';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import axios from 'axios';
<<<<<<< HEAD
=======
import { LogOut } from 'lucide-react';
>>>>>>> 4d1eafa (impoved frontend UI)

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
<<<<<<< HEAD
      className="h-9 px-5 rounded-full bg-[#CC0000] hover:bg-[#990000] text-white text-lg font-medium transition-colors duration-200 shadow-sm"
    >
      {loading ? <LoadingSpinner /> : 'Logout'}
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
    </Button>
  );
}

export default LogoutBtn;
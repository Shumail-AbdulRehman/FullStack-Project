import React, { useState } from 'react';
import { Button } from '../ui/button';
import LoadingSpinner from './LoadingSpinner';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import axios from 'axios';
function LogoutBtn() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    setLoading(true);
    const res = await axios.post(
      'http://localhost:8000/api/v1/users/logout',
      {},
      { withCredentials: true }
    );
    dispatch(logout());
    setLoading(false);
  };

  return (
    <div>
      <Button onClick={handleSubmit}>
        {loading ? <LoadingSpinner /> : <h1>Logout</h1>}
      </Button>
    </div>
  );
}

export default LogoutBtn;

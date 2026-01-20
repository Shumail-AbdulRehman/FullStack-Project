import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/custom/Navbar';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from './store/authSlice';
import { Outlet } from 'react-router-dom';
import LoadingSpinner from './components/custom/LoadingSpinner';
import { useQueryClient } from '@tanstack/react-query';

function App() {
  const [loading, setLoading] = useState(true); // Start true to prevent flicker
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const addNotification = (newNotification) => {
    queryClient.setQueryData(['notifications'], (oldData) => {
      if (!oldData) return [newNotification];
      return [newNotification, ...oldData];
    });
  };

  // WebSocket Effect (Kept as is)
  useEffect(() => {
    if (!userData) return;
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      ws.send(JSON.stringify({ userId: userData._id }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addNotification(data);
    };

    return () => ws.close();
  }, [userData]);

  // --- REMOVED THE SECOND useEffect HERE ---
  // We don't want to wait for a re-render to dispatch to Redux.

  useEffect(() => {
    const checkAuth = async () => {
      // setLoading(true); // Not needed if initialized to true
      try {
        const currentUser = await axios.get(
          'http://localhost:8000/api/v1/users/current-user',
          { withCredentials: true }
        );

        const user = currentUser.data?.data;
        
        // 1. Update Local State
        setUserData(user);
        
        // 2. CRITICAL FIX: Dispatch to Redux IMMEDIATELY
        if (user) {
            dispatch(login(user));
        }

      } catch (error) {
        // Handle Token Refresh Logic
        if (error.response?.status) {
          try {
            const generateTokens = await axios.post(
              'http://localhost:8000/api/v1/users/refreshtoken',
              {},
              { withCredentials: true }
            );
            
            // If refresh worked, usually you need to fetch user again 
            // OR if the refresh endpoint returns the user, use that.
            // Assuming refresh just fixes cookies, we might need to retry the get request
            // But for now, let's assume we handle state based on success.
            
            // Ideally, you should fetch the user again here if refresh succeeded
             const retryUser = await axios.get(
              'http://localhost:8000/api/v1/users/current-user',
              { withCredentials: true }
            );
            
            const refreshedUser = retryUser.data?.data;
            setUserData(refreshedUser);
            if(refreshedUser) dispatch(login(refreshedUser));

          } catch (refreshError) {
            console.log('Session expired');
            setUserData(null);
            // Optional: dispatch(logout()) here
          }
        }
      } finally {
        // 3. ONLY NOW allow the app to render the Outlet
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Dependencies empty is correct

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-[#0f0f0f]">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
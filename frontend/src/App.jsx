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
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Helper to update React Query cache immediately when a notification arrives
  const addNotification = (newNotification) => {
    queryClient.setQueryData(['notifications'], (oldData) => {
      // If no notifications exist yet, create array
      if (!oldData) return [newNotification];
      
      // Add new notification to the top of the list
      return [newNotification, ...oldData];
    });
  };

  // ✅ 1. UPDATED WEBSOCKET LOGIC
  useEffect(() => {
    // Only connect if user is logged in
    if (!userData) return;

    // The browser will AUTOMATICALLY send cookies with this request
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket Server');
      // ❌ REMOVED: ws.send(JSON.stringify({ userId: ... }));
      // We don't need to send ID manually anymore. The cookie handles it.
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("New Notification:", data);
        addNotification(data);
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Cleanup on unmount or when userData changes
    return () => {
      if (ws.readyState === 1) { // 1 means OPEN
          ws.close();
      }
    };
  }, [userData]); 

  // 2. AUTH CHECK LOGIC (Unchanged)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await axios.get(
          'http://localhost:8000/api/v1/users/current-user',
          { withCredentials: true }
        );

        const user = currentUser.data?.data;
        setUserData(user);

        if (user) {
          dispatch(login(user));
        }

      } catch (error) {
        if (error.response?.status) {
          try {
            // Attempt Refresh
            await axios.post(
              'http://localhost:8000/api/v1/users/refreshtoken',
              {},
              { withCredentials: true }
            );

            // Retry Current User
            const retryUser = await axios.get(
              'http://localhost:8000/api/v1/users/current-user',
              { withCredentials: true }
            );

            const refreshedUser = retryUser.data?.data;
            setUserData(refreshedUser);
            if (refreshedUser) dispatch(login(refreshedUser));

          } catch (refreshError) {
            setUserData(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#050508]">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
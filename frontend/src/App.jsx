import { useEffect, useState, useCallback, useRef } from 'react';
import './App.css';
import Navbar from './components/custom/Navbar';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from './store/authSlice';
import { Outlet } from 'react-router-dom';
import LoadingSpinner from './components/custom/LoadingSpinner';
import { useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

function App() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);

  const addNotification = useCallback((newNotification) => {
    queryClient.setQueryData(['notifications'], (oldData) => {
      if (!oldData) return undefined;

      return {
        ...oldData,
        pages: oldData.pages.map((page, index) => {
          if (index === 0) {
            return {
              ...page,
              docs: [newNotification, ...page.docs],
            };
          }
          return page;
        }),
      };
    });
  }, [queryClient]);

  useEffect(() => {
    if (!userData?._id) return;

    const connectWebSocket = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to WebSocket Server');
        reconnectAttempts.current = 0;
        ws.send(JSON.stringify({ type: 'register', userId: userData._id }));
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

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);

        if (userData?._id) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          console.log(`Reconnecting in ${timeout / 1000}s...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connectWebSocket();
          }, timeout);
        }
      };
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [userData?._id, addNotification]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await axios.get(
          `${API_URL}/api/v1/users/current-user`,
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
            await axios.post(
              `${API_URL}/api/v1/users/refreshtoken`,
              {},
              { withCredentials: true }
            );

            const retryUser = await axios.get(
              `${API_URL}/api/v1/users/current-user`,
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
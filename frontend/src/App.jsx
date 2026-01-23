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
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const addNotification = (newNotification) => {
    queryClient.setQueryData(['notifications'], (oldData) => {
      if (!oldData) return [newNotification];
      return [newNotification, ...oldData];
    });
  };


  useEffect(() => {
    if (!userData) return;
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {

      ws.send(JSON.stringify({ userId: userData._id }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addNotification(data);
    };

    return () => ws.close();
  }, [userData]);

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
            await axios.post(
              'http://localhost:8000/api/v1/users/refreshtoken',
              {},
              { withCredentials: true }
            );

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
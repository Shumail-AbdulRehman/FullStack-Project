import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();

  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (loading) return;

    if (authentication && !isAuthenticated) {
      navigate('/login');
    }

    if (!authentication && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authentication, navigate, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <div>{children}</div>;
}

export default AuthLayout;

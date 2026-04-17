import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, dbUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner overlay text="Verifying Access..." />;
  }

  const groups = user?.signInUserSession?.accessToken?.payload?.["cognito:groups"];
  console.log("AdminRoute groups:", groups);
  const isAdmin = groups?.includes("admins") || dbUser?.role === 'admin';

  if (!user || !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;

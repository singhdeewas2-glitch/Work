import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, dbUser, loading } = useAuth();

  if (loading) {
    return <div className="loader"></div>;
  }

  if (!user || !dbUser || dbUser.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;

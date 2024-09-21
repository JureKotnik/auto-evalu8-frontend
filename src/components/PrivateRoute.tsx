import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';  // Assume you have a useAuth hook for authentication status

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();  // Check if the user is authenticated

  if (!isAuthenticated) {
    // Redirect to auth page with mode=login if not authenticated
    return <Navigate to="/auth?mode=login" />;
  }

  return <>{children}</>;  // Render the children components if authenticated
};

export default PrivateRoute;

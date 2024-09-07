import React from 'react';
import { Route, Navigate, RouteProps, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  element: React.ReactElement;
  path: string;
  // Add other RouteProps if needed
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, path }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;

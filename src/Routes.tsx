import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CarDetailsPage from './pages/CarDetailsPage';
import PrivateRoute from './components/PrivateRoute';
import AuthPage from './pages/AuthPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/cars/:id"
        element={
          <PrivateRoute>
            <CarDetailsPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

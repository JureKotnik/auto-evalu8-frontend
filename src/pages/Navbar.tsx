// src/components/Navbar.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Manage authentication state
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Check if a JWT token is present in local storage or cookies to determine if the user is logged in
    const token = localStorage.getItem('jwt');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      // Make a request to the backend to sign out (optional)
      await axios.post('http://localhost:3000/users/signout');
      
      // Remove the JWT token from local storage
      localStorage.removeItem('jwt');
      setIsAuthenticated(false);
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
      <h1>AutoEvalu8</h1>
      <div style={{ display: 'flex', gap: '10px' }}>
        {isAuthenticated ? (
          <>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

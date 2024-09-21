import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/Navbar.css';

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Manage authentication state
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Check if a JWT token is present in local storage or cookies to determine if the user is logged in
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Set authentication status based on token presence
  }, []);
  
  const handleLogout = async () => {
    try {
      // Make a request to the backend to sign out, sending credentials (cookies)
      await axios.post('http://localhost:3000/auth/signout', {}, { withCredentials: true });
      
      // Remove the JWT token from local storage
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo" onClick={() => navigate('/')}>AutoEvalu8</h1>
        <div className="navbar-links">
          {isAuthenticated ? (
            <button className="navbar-button" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <button className="navbar-button" onClick={() => navigate('/auth?mode=login')}>Login</button>
              <button className="navbar-button navbar-button-register" onClick={() => navigate('/auth?mode=register')}>Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

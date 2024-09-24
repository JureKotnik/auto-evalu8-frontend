import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/Navbar.css';

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/auth/signout', {}, { withCredentials: true });
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <nav className={"navbar"}>
      <div className="navbar-container">
        <h1 className="navbar-logo" onClick={() => navigate('/')}>AUTOEVALU8</h1>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <button className="navbar-button" onClick={() => navigate('/add-car')}>Add Car</button>
              <button className="navbar-button" onClick={handleLogout}>Logout</button>
            </>
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



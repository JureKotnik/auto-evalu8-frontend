import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../assets/css/AuthPage.css';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login and register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();  // Hook to access query parameters

  // UseEffect to check the query parameter and set the mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsLogin(false);  // Show register form if mode is register
    } else {
      setIsLogin(true);   // Default to login form
    }
  }, [searchParams]);

  // Handle login submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  // Handle register submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        username,
        email,
        password,
      });
      if (response.status === 201) {
        alert('Registration successful!');
        navigate('/login');
      }
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
    <div className={`auth-container ${isLogin ? 'login-mode' : 'register-mode'}`}>
      <div className="auth-panel">
        {isLogin ? (
          <div className="auth-left">
            <h2>Sign In</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="auth-button">Sign In</button>
            </form>
            {error && <p className="error">{error}</p>}
          </div>
        ) : (
          <div className="auth-left">
            <h2>Welcome Back!</h2>
            <p>If you have an account, you can log in here.</p>
            <button className="auth-button" onClick={() => setIsLogin(true)}>Login</button>
          </div>
        )}

        {isLogin ? (
          <div className="auth-right">
            <h2>Welcome to Login</h2>
            <p>Don't have an account?</p>
            <button className="auth-button" onClick={() => setIsLogin(false)}>Sign Up</button>
          </div>
        ) : (
          <div className="auth-right">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className="auth-button">Sign Up</button>
            </form>
            {error && <p className="error">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;

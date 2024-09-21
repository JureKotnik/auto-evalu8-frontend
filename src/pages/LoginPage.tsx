import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const goToSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <div className="login-left">
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
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#">Forgot Password</a>
          </div>
          <button type="submit" className="sign-in-button">Sign In</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
      <div className="login-right">
        <h2>Welcome to login</h2>
        <p>Don't have an account?</p>
        <button className="sign-up-button"  onClick={goToSignUp}>Sign Up</button>
      </div>
    </div>
  );
};

export default LoginPage;

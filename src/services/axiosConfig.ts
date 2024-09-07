import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',  // Set this to your NestJS backend URL
});

// Intercept request and attach token if it exists
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;

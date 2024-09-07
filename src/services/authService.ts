import axios from './axiosConfig';

export const login = async (email: string, password: string) => {
  const response = await axios.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const register = async (email: string, password: string, username: string) => {
  const response = await axios.post('/auth/register', { email, password, username });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

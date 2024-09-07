import { useState, useEffect } from 'react';
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  user: any; // Replace `any` with a more specific type if needed
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    // Fetch authentication status and user data from API or local storage
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/api/auth/status'); // Adjust URL as needed
        setAuthState({
          isAuthenticated: true,
          user: response.data,
        });
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          user: null,
        });
      }
    };

    checkAuthStatus();
  }, []);

  return authState;
};

import { useState, useEffect } from 'react';
import api from '../components/api';
import axios from 'axios';

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  picture?: string;
}

export const useCars = (searchQuery: string) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/cars', {
          params: { search: searchQuery },
        });
        setCars(response.data);
        setError(null);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [searchQuery]);

  return { cars, loading, error };
};
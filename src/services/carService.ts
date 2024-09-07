import axios from 'axios';
import { Review } from '../types/review';
import { Car } from '../types/Car';

const API_URL = 'http://localhost:3000';

export const fetchCars = async (searchTerm: string): Promise<Car[]> => {
    const response = await axios.get(`${API_URL}/cars`, {
      params: { search: searchTerm }
    });
    return response.data;
  };
  
export const fetchCarDetails = async (carId: number): Promise<Car> => {
  const response = await axios.get(`${API_URL}/cars/${carId}`);
  return response.data;
};

export const fetchCarReviews = async (carId: number): Promise<Review[]> => {
  const response = await axios.get(`${API_URL}/reviews/car/${carId}`);
  return response.data;
};

export const postReview = async (carId: number, reviewData: Partial<Review>): Promise<Review> => {
  const response = await axios.post(`${API_URL}/reviews/car/${carId}`, reviewData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`  // Adjust token handling as needed
    }
  });
  return response.data;
};

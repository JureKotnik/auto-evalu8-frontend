import axios from './axiosConfig';

export const fetchReviewsByCarId = async (carId: number) => {
  const response = await axios.get(`/reviews/car/${carId}`);
  return response.data;
};

export const createReview = async (carId: number, content: string) => {
  const response = await axios.post(`/reviews/car/${carId}`, { content });
  return response.data;
};

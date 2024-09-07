import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Review {
  id: number;
  comfort: number;
  looks: number;
  reliability: number;
}

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  picture?: string;
  averageComfort: number;
  averageLooks: number;
  averageReliability: number;
  reviews: Review[];
}

const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/cars/${id}`);
        setCar(response.data);
      } catch (error) {
        setError('Failed to fetch car details');
      }
    };

    fetchCar();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!car) return <p>Loading...</p>;

  return (
    <div>
      <h1>{car.make} {car.model}</h1>
      <p>Year: {car.year}</p>
      {car.picture && <img src={`http://localhost:3000/${car.picture}`} alt={car.make} style={{ width: '300px' }} />}
      <h2>Reviews</h2>
      <ul>
        {car.reviews.map(review => (
          <li key={review.id}>
            Comfort: {review.comfort}, Looks: {review.looks}, Reliability: {review.reliability}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarDetailsPage;

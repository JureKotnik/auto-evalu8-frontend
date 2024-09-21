// CarDetailsPage.tsx

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
  picture?: string | null;
  averageComfort: number;
  averageLooks: number;
  averageReliability: number;
  reviews: Review[];
}

const CarDetailsPage: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();  // Capture carId from the URL
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debugging: Log carId to ensure it’s being passed correctly
  useEffect(() => {
    console.log('Car ID from URL (useParams):', carId);  // Log carId for debugging

    if (!carId) {
      setError('Car ID is missing.');
      return;
    }

    const fetchCar = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/cars/${carId}`);
        console.log('Car details fetched:', response.data);  // Debugging line
        const carData = {
          ...response.data,
          reviews: response.data.reviews || [], // Ensure reviews are always an array
        };
        setCar(carData);
      } catch (error) {
        console.error('Error fetching car details:', error);  // Debugging line
        setError('Failed to fetch car details');
      }
    };

    fetchCar();
  }, [carId]);  // carId is the dependency to trigger the effect

  // Handle loading and error states
  if (error) return <p>{error}</p>;
  if (!car) return <p>Loading car details...</p>;

  // Placeholder image if no car image is available
  const placeholderImage = 'https://via.placeholder.com/300x200?text=No+Image+Available';

  const calculateAverageOverall = () => {
    if (!car || car.reviews.length === 0) return 0;

    const total = car.reviews.reduce(
      (acc, review) => acc + (review.comfort + review.looks + review.reliability) / 3,
      0
    );
    return total / car.reviews.length / 2; // Convert to 5-point scale
  };

  const averageOverall = calculateAverageOverall().toFixed(1);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>{car.make} {car.model} ({car.year})</h1>
      {car.picture ? (
        <img src={`http://localhost:3000/uploads/cars/${car.picture}`} alt={car.make} style={{ width: '100%', borderRadius: '8px' }} />
      ) : (
        <img src={placeholderImage} alt="No Image Available" style={{ width: '100%', borderRadius: '8px' }} />
      )}

      <h2>Average Overall Rating</h2>
      <ReviewStars label="Overall" value={Number(averageOverall)} />

      <h2>Reviews</h2>
      {car.reviews.length > 0 ? (
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {car.reviews.map((review) => (
            <li key={review.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              <ReviewStars label="Comfort" value={review.comfort / 2} /> {/* Convert to 5-point scale */}
              <ReviewStars label="Looks" value={review.looks / 2} /> {/* Convert to 5-point scale */}
              <ReviewStars label="Reliability" value={review.reliability / 2} /> {/* Convert to 5-point scale */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
};

// Component to render star ratings for individual reviews and overall rating
interface ReviewStarsProps {
  label: string;
  value: number;
}

const ReviewStars: React.FC<ReviewStarsProps> = ({ label, value }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(value) ? '★' : '☆');

  return (
    <div style={{ marginBottom: '10px' }}>
      <strong>{label}: </strong>
      <span style={{ color: '#FFD700', fontSize: '20px' }}>{stars.join(' ')}</span>
      <span> ({value.toFixed(1)} / 5)</span>
    </div>
  );
};

export default CarDetailsPage;

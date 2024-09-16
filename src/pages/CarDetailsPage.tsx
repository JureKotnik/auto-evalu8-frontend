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
  reviews: Review[]; // Ensure reviews are defined as an array
}

const CarDetailsPage: React.FC = () => {
  const { carId } = useParams<{ carId: string }>(); // Use carId to match the route parameter
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('CarDetailsPage mounted'); // Debugging line
    console.log('Car ID from URL (useParams):', carId); // Log the car ID from the URL

    if (!carId) {
      console.error('No car ID found in URL.'); // Debugging line
      setError('Car ID is missing.');
      return;
    }

    const fetchCar = async () => {
      console.log('Fetching car with id:', carId); // Debugging line
      try {
        const response = await axios.get(`http://localhost:3000/cars/${carId}`);
        console.log('Car details fetched:', response.data); // Debugging line
        
        // Initialize reviews to an empty array if they are undefined
        const carData = {
          ...response.data,
          reviews: response.data.reviews || [], // Ensure reviews is always an array
        };
        
        setCar(carData);
      } catch (error) {
        console.error('Error fetching car details:', error); // Debugging line
        setError('Failed to fetch car details');
      }
    };

    fetchCar();
  }, [carId]);

  if (error) return <p>{error}</p>;
  if (!car) return <p>Loading...</p>;

  // Define a placeholder image URL
  const placeholderImage = 'https://via.placeholder.com/300x200?text=No+Image+Available';

  // Calculate average overall rating out of 5
  const calculateAverageOverall = () => {
    if (!car || !car.reviews || car.reviews.length === 0) return 0; // Check if car and reviews are available

    const total = car.reviews.reduce(
      (acc, review) => acc + (review.comfort + review.looks + review.reliability) / 3,
      0
    );
    return (total / car.reviews.length) / 2; // Convert to 5-point scale
  };

  const averageOverall = calculateAverageOverall().toFixed(1);

  return (
    <div>
      <h1>{car.make} {car.model}</h1>
      <p>Year: {car.year}</p>
      {car.picture ? (
        <img src={`http://localhost:3000/uploads/cars/${car.picture}`} alt={car.make} style={{ width: '300px' }} />
      ) : (
        <img src={placeholderImage} alt="No Image Available" style={{ width: '300px' }} />  // Use placeholder image
      )}

      {/* Display average overall rating as stars */}
      <h2>Average Overall Rating</h2>
      <ReviewStars label="Overall" value={Number(averageOverall)} />

      <h2>Reviews</h2>
      {car.reviews.length > 0 ? (
        <ul>
          {car.reviews.map((review) => (
            <li key={review.id} style={{ marginBottom: '20px' }}>
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

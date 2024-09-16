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
  const { carId } = useParams<{ carId: string }>();  // Use carId to match the route parameter
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('CarDetailsPage mounted');  // Debugging line
    console.log('Car ID from URL (useParams):', carId);  // Log the car ID from the URL

    if (!carId) {
      console.error('No car ID found in URL.');  // Debugging line
      setError('Car ID is missing.');
      return;
    }

    const fetchCar = async () => {
      console.log('Fetching car with id:', carId);  // Debugging line
      try {
        const response = await axios.get(`http://localhost:3000/cars/${carId}`);
        console.log('Car details fetched:', response.data);  // Debugging line
        setCar(response.data);
      } catch (error) {
        console.error('Error fetching car details:', error);  // Debugging line
        setError('Failed to fetch car details');
      }
    };

    fetchCar();
  }, [carId]);

  if (error) return <p>{error}</p>;
  if (!car) return <p>Loading...</p>;

  // Define a placeholder image URL
  const placeholderImage = 'https://via.placeholder.com/300x200?text=No+Image+Available';

  // Calculate average overall rating
  const calculateAverageOverall = () => {
    const total = car!.reviews.reduce(
      (acc, review) => acc + (review.comfort + review.looks + review.reliability) / 3,
      0
    );
    return total / car!.reviews.length;
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

      {/* Display average overall rating bar */}
      <h2>Average Overall Rating</h2>
      <OverallRatingBar average={Number(averageOverall)} />

      <h2>Reviews</h2>
      {car.reviews.length > 0 ? (
        <ul>
          {car.reviews.map((review) => (
            <li key={review.id} style={{ marginBottom: '20px' }}>
              <ReviewStars label="Comfort" value={review.comfort} />
              <ReviewStars label="Looks" value={review.looks} />
              <ReviewStars label="Reliability" value={review.reliability} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
};

// Component to render a color-coded overall rating bar
interface OverallRatingBarProps {
  average: number;
}

const OverallRatingBar: React.FC<OverallRatingBarProps> = ({ average }) => {
  // Determine color based on average value
  const getColor = (value: number) => {
    if (value <= 3) return '#f44336'; // Red for 0-3
    if (value <= 7) return '#ff9800'; // Yellow for 4-7
    return '#4CAF50'; // Green for 8-10
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ backgroundColor: '#e0e0e0', borderRadius: '5px', width: '100%', height: '30px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${(average / 10) * 100}%`,
            height: '100%',
            backgroundColor: getColor(average), // Use dynamic color
            transition: 'width 0.5s ease', // Optional: smooth transition
          }}
        />
      </div>
      <span>Overall Rating: {average} / 10</span>
    </div>
  );
};

// Component to render star ratings for individual reviews
interface ReviewStarsProps {
  label: string;
  value: number;
}

const ReviewStars: React.FC<ReviewStarsProps> = ({ label, value }) => {
  const stars = Array.from({ length: 10 }, (_, i) => i < value ? '★' : '☆');

  return (
    <div style={{ marginBottom: '10px' }}>
      <strong>{label}: </strong>
      <span style={{ color: '#FFD700', fontSize: '20px' }}>{stars.join(' ')}</span>
    </div>
  );
};

export default CarDetailsPage;

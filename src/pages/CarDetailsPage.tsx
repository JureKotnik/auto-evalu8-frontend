import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/CarDetailsPage.css';

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
  const navigate = useNavigate(); // To allow closing the modal and navigating away

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
        const carData = {
          ...response.data,
          reviews: response.data.reviews || [], // Ensure reviews are always an array
        };
        setCar(carData);
      } catch (error) {
        setError('Failed to fetch car details');
      }
    };

    fetchCar();
  }, [carId]);

  // Handle closing the modal
  const handleClose = () => {
    navigate('/'); // Navigate back to home or any other page
  };

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
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={handleClose}>×</button>
        <h1>{car.make} {car.model} ({car.year})</h1>
        {car.picture ? (
          <img src={`http://localhost:3000/uploads/cars/${car.picture}`} alt={car.make} className="car-image" />
        ) : (
          <img src={placeholderImage} alt="No Image Available" className="car-image" />
        )}

        <h2>Average Overall Rating</h2>
        <ReviewStars label="Overall" value={Number(averageOverall)} />

        <h2>Reviews</h2>
        {car.reviews.length > 0 ? (
          <ul className="reviews-list">
            {car.reviews.map((review) => (
              <li key={review.id} className="review-item">
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
    <div className="review-stars">
      <strong>{label}: </strong>
      <span className="stars">{stars.join(' ')}</span>
      <span> ({value.toFixed(1)} / 5)</span>
    </div>
  );
};

export default CarDetailsPage;


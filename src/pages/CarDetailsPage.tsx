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
  const { carId } = useParams<{ carId: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!carId) {
      setError('Car ID is missing.');
      return;
    }

    const fetchCar = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/cars/${carId}`);
        const carData = {
          ...response.data,
          reviews: response.data.reviews || [],
        };
        setCar(carData);
      } catch (error) {
        setError('Failed to fetch car details');
      }
    };

    fetchCar();
  }, [carId]);

  const handleClose = () => {
    navigate('/');
  };

  if (error) return <p>{error}</p>;
  if (!car) return <p>Loading car details...</p>;

  const placeholderImage = 'https://via.placeholder.com/300x200?text=No+Image+Available';

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={handleClose}>×</button>
        <h1>{car.make} {car.model} ({car.year})</h1>
        {car.picture ? (
          <img src={`http://localhost:3000/uploads/${car.picture}`} alt={car.make} className="car-image" />
        ) : (
          <img src={placeholderImage} alt="No Image Available" className="car-image" />
        )}

        <h2>Average Ratings</h2>
        <div className="rating-container">
          <p>Comfort: <ReviewStars value={car.averageComfort} /></p>
          <p>Looks: <ReviewStars value={car.averageLooks} /></p>
          <p>Reliability: <ReviewStars value={car.averageReliability} /></p>
        </div>

        <h2>Reviews</h2>
        {car.reviews.length > 0 ? (
          <ul className="reviews-list">
            {car.reviews.map((review) => (
              <li key={review.id} className="review-item">
                <p>Comfort: {review.comfort}</p>
                <p>Looks: {review.looks}</p>
                <p>Reliability: {review.reliability}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Overall: <ReviewStars value={(car.averageComfort + car.averageLooks + car.averageReliability) / 3} /></p>
        )}
      </div>
    </div>
  );
};

interface ReviewStarsProps {
  value: number;
}

const ReviewStars: React.FC<ReviewStarsProps> = ({ value }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (i < Math.round(value) ? '★' : '☆'));
  return (
    <span className="stars">
      {stars.join(' ')} ({value.toFixed(1)} / 5)
    </span>
  );
};

export default CarDetailsPage;

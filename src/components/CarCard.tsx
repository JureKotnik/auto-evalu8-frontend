import React from 'react';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory

interface Review {
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
  reviews?: Review[];  // Added reviews field
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const navigate = useNavigate();  // Use useNavigate
  const placeholderImage = 'https://via.placeholder.com/150?text=No+Image';

  // Calculate the average overall rating if reviews are available
  const calculateAverageRating = (reviews: Review[] | undefined) => {
    if (!reviews || reviews.length === 0) return 'No reviews';

    const totalRatings = reviews.reduce(
      (acc, review) => acc + (review.comfort + review.looks + review.reliability) / 3,
      0
    );
    const averageRating = totalRatings / reviews.length;
    return averageRating.toFixed(1); // Return average to one decimal place
  };

  const handleClick = () => {
    navigate(`/cars/${car.id}`);  // Replace history.push with navigate
  };

  return (
    <div
      onClick={handleClick}
      style={{
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        cursor: 'pointer',
        width: '150px',
        textAlign: 'center',
      }}
    >
      <img
        src={car.picture ? `http://localhost:3000/uploads/cars/${car.picture}` : placeholderImage}
        alt={car.make}
        style={{ width: '100%', borderRadius: '5px' }}
      />
      <h3>{car.make} {car.model}</h3>
      <p>{car.year}</p>
      {/* Display average overall review */}
      <p>Average Rating: {calculateAverageRating(car.reviews)}</p>
    </div>
  );
};

export default CarCard;


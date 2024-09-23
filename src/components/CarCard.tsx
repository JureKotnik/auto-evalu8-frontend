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
  const calculateAverageRating = (reviews: Review[] | undefined): number => {
    if (!reviews || reviews.length === 0) return 0;

    const totalRatings = reviews.reduce(
      (acc, review) => acc + (review.comfort + review.looks + review.reliability) / 3,
      0
    );
    const averageRating = totalRatings / reviews.length;
    return parseFloat(averageRating.toFixed(1)); // Return average to one decimal place
  };

  // Function to generate star icons based on the rating
  const generateStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.round(rating) ? '★' : '☆'); // Filled star if within rating, else empty star
    }
    return stars.join(' ');
  };

  const handleClick = () => {
    navigate(`/cars/${car.id}`);  // Replace history.push with navigate
  };

  // Get the average rating for display
  const averageRating = calculateAverageRating(car.reviews);

  return (
    <div
      onClick={handleClick}
      style={{
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        cursor: 'pointer',
        width: '250px',
        textAlign: 'center',
      }}
    >
      <img
        src={car.picture ? `http://localhost:3000/uploads/${car.picture}` : placeholderImage}
        alt={car.make}
        style={{ width: '100%', borderRadius: '5px' }}
      />
      <h3>{car.make} {car.model}</h3>
      <p>{car.year}</p>
      {/* Display average overall review as stars */}
      <p>
        {averageRating > 0 ? generateStars(averageRating) : 'No reviews'}
      </p>
    </div>
  );
};

export default CarCard;


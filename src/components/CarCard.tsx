import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/CarCard.css';

interface Review {
  comfort: number;
  looks: number;
  reliability: number;
}

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  picture?: string;
  averageComfort?: number; 
  averageLooks?: number; 
  averageReliability?: number; 
  reviews?: Review[]; 
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const navigate = useNavigate();
  const placeholderImage = 'https://via.placeholder.com/150?text=No+Image';

  // Calculate the average overall rating if averages are available
  const calculateAverageRating = (): number => {
    const ratings = [
      car.averageComfort,
      car.averageLooks,
      car.averageReliability,
    ].filter(Boolean) as number[];
    
    if (ratings.length === 0) return 0;
    
    const total = ratings.reduce((acc, rating) => acc + rating, 0);
    return parseFloat((total / ratings.length).toFixed(1)); // Return average to one decimal place
  };

  const averageRating = calculateAverageRating();

  // Function to generate star icons based on the rating
  const generateStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.round(rating) ? 'star filled' : 'star'}>★</span>
      ); // Filled star if within rating, else empty star
    }
    return stars;
  };

  const handleClick = () => {
    navigate(`/cars/${car.id}`);
  };

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
      {/* Display average rating as stars or indicate no reviews */}
      <p>
        {averageRating > 0 ? generateStars(averageRating) : 'No reviews'}
      </p>
    </div>
  );
};

export default CarCard;



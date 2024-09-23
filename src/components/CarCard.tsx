import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  picture?: string; // Use existing picture property
  averageComfort?: number; // Average comfort rating
  averageLooks?: number; // Average looks rating
  averageReliability?: number; // Average reliability rating
  reviews?: Review[]; // Added reviews field if needed
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
      {/* Display average rating or indicate no reviews */}
      <p>
        {averageRating > 0 ? `Average Rating: ${averageRating} / 5` : 'No reviews'}
      </p>
    </div>
  );
};

export default CarCard;



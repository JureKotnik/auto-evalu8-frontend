import React from 'react';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  picture?: string;
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const navigate = useNavigate();  // Use useNavigate
  const placeholderImage = 'https://via.placeholder.com/150?text=No+Image';

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
      }}
    >
      <img
        src={car.picture ? `http://localhost:3000/uploads/cars/${car.picture}` : placeholderImage}
        alt={car.make}
        style={{ width: '100%', borderRadius: '5px' }}
      />
      <h3>{car.make} {car.model}</h3>
      <p>{car.year}</p>
    </div>
  );
};

export default CarCard;

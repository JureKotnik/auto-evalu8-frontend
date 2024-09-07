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

  const handleClick = () => {
    navigate(`/car/${car.id}`);  // Replace history.push with navigate
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
      {car.picture ? (
        <img src={`http://localhost:3000/${car.picture}`} alt={car.make} style={{ width: '100%' }} />
      ) : (
        <div>No Image</div>
      )}
      <h3>{car.make}</h3>
      <p>{car.model}</p>
      <p>{car.year}</p>
    </div>
  );
};

export default CarCard;

import React, { useState } from 'react';
import { useCars } from '../hooks/useCars';
import CarCard from '../components/CarCard';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { cars, loading, error } = useCars(searchQuery);

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for cars"
      />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;

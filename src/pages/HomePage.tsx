import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarCard from '../components/CarCard';
import Navbar from './Navbar';


interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  picture?: string;
  averageComfort: number;
  averageLooks: number;
  averageReliability: number;
  reviews: { id: number; comfort: number; looks: number; reliability: number }[];
}

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cars, setCars] = useState<Car[]>([]);
  const [recentCars, setRecentCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the most recent 5-10 cars initially
    const fetchRecentCars = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/cars', {
          params: { limit: 10 }, // Adjust the limit as needed
        });
        setRecentCars(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch recent cars');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentCars();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // If no search query, reset to show recent cars
      setCars(recentCars);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/cars', {
        params: {
          search: searchQuery, // Backend should handle searching by make or model
        },
      });
      setCars(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  // Trigger search whenever the user types and presses Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <Navbar /> {/* Include the Navbar component */}

      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown} // Search on Enter key press
          placeholder="Search for cars by make or model"
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      
      {/* Show search results if there is a search query, otherwise show recent cars */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
        {searchQuery.trim()
          ? cars.map((car) => <CarCard key={car.id} car={car} />)
          : recentCars.map((car) => <CarCard key={car.id} car={car} />)}
      </div>
    </div>
  );
};

export default HomePage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarCard from '../components/CarCard';
import Navbar from './Navbar';
import '../assets/css/HomePage.css';

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
  const [searchQuery, setSearchQuery] = useState('');  // Query state for search input
  const [cars, setCars] = useState<Car[]>([]);  // State to hold fetched cars
  const [loading, setLoading] = useState<boolean>(false);  // Loading state
  const [error, setError] = useState<string | null>(null);  // Error state

  // Fetch the initial 10 cars when the component loads
  useEffect(() => {
    const fetchRecentCars = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/cars', {
          params: { limit: 20 },  // Fetch recent 10 cars
        });
        setCars(response.data);  // Set the fetched cars into state
        setError(null);  // Clear any errors
      } catch (error) {
        setError('Failed to fetch recent cars');  // Set error if fetching fails
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    fetchRecentCars();
  }, []);  // Empty dependency array to run this effect on component mount

  // Handle the search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;  // Prevent search if input is empty

    setLoading(true);  // Start loading
    try {
      const response = await axios.get('http://localhost:3000/cars', {
        params: {
          search: searchQuery,  // Pass the search query to backend
        },
      });
      setCars(response.data);  // Update the state with search results
      setError(null);  // Clear any errors
    } catch (error) {
      setError('Failed to fetch cars');  // Set error if search fails
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  // Trigger search when pressing "Enter" key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();  // Trigger search on Enter key press
    }
  };

  return (
    <div>
      <Navbar />  {/* Include the Navbar */}

      <div className="home-container">
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}  // Search on Enter key press
            placeholder="Search for cars by make or model"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">Search</button>
        </div>

        {loading && <p>Loading cars...</p>}
        {error && <p>{error}</p>}

        <div className="car-grid">
          {cars.length > 0 ? (
            cars.map((car) => (
              <CarCard key={car.id} car={car} />  // Render each car card
            ))
          ) : (
            !loading && <p>No cars available</p>  // Fallback message when no cars
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

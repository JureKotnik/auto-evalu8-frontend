import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCar: React.FC = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | string>(''); // Keeping it as a string for input
  const [picture, setPicture] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', model);
    formData.append('year', year.toString()); // Append as a string; backend will convert to number
    console.log('Year value before sending:', year);
    
    if (picture) {
      formData.append('picture', picture);
    }

    const token = localStorage.getItem('token');
    console.log('Token before API call:', token);

    try {
      const response = await axios.post('http://localhost:3000/cars', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log('Car added successfully:', response.data);
      navigate('/'); // Redirect after successful submission
    } catch (error: any) {
      console.error('Failed to add car', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Add Car</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Make:</label>
          <input type="text" value={make} onChange={(e) => setMake(e.target.value)} required />
        </div>
        <div>
          <label>Model:</label>
          <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
        </div>
        <div>
          <label>Year:</label>
          <input 
            type="number" 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))} // Convert input to number
            required 
          />
        </div>
        <div>
          <label>Picture:</label>
          <input type="file" accept="image/*" onChange={(e) => setPicture(e.target.files![0])} />
        </div>
        <button type="submit">Add Car</button>
      </form>
    </div>
  );
};

export default AddCar;

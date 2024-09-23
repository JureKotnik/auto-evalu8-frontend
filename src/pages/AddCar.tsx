import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/AddCars.css'; // Ensure you have your styles
import Navbar from './Navbar';

const AddCar: React.FC = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | string>(''); // Keeping it as a string for input
  const [picture, setPicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null); // State for image preview
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', model);
    formData.append('year', year.toString()); // Append as a string
    if (picture) {
      formData.append('picture', picture);
    }

    const token = localStorage.getItem('token');

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

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPicture(file || null);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result as string); // Set the preview URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    } else {
      setPicturePreview(null); // Clear preview if no file is selected
    }
  };

  return (
    <div className="add-car-container"> {/* New container for centering */}
        <Navbar />
      <div className="add-car-form">
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
              onChange={(e) => setYear(Number(e.target.value))} 
              required 
            />
          </div>
          <div>
            <label>Picture:</label>
            <input type="file" accept="image/*" onChange={handlePictureChange} />
          </div>
          {picturePreview && (
            <div className="image-preview">
              <h3>Preview:</h3>
              <img src={picturePreview} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
            </div>
          )}
          <button type="submit">Add Car</button>
        </form>
      </div>
    </div>
  );
};

export default AddCar;

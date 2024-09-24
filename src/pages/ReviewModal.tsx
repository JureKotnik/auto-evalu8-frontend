import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/ReviewModal.css';

interface ReviewModalProps {
  carId: string;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ carId, onClose, onReviewSubmitted }) => {
  const [comfort, setComfort] = useState<number | null>(null);
  const [looks, setLooks] = useState<number | null>(null);
  const [reliability, setReliability] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submit function called');
    
    const userId = localStorage.getItem('userId'); // Get user ID from local storage
    const token = localStorage.getItem('token'); // Get the token from local storage
    
    if (!comfort || !looks || !reliability || !userId) return;
  
    try {
      const response = await axios.post(`http://localhost:3000/reviews/${carId}`, {
        comfort,
        looks,
        reliability,
        userId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the headers
        },
        withCredentials: true, // Important for cookies, if needed
      });
  
      console.log('Review added successfully:', response.data);
      onReviewSubmitted();
      onClose();
    } catch (error) {
      console.error('Failed to add review', error);
    }
  };
  
  

  return (
    <div className="review-modal">
      <div className="review-modal-content">
        <button className="review-close-button" onClick={onClose}>×</button>
        <h2>Add a Review</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Comfort:</label>
            <StarRating value={comfort} onChange={setComfort} />
          </div>
          <div>
            <label>Looks:</label>
            <StarRating value={looks} onChange={setLooks} />
          </div>
          <div>
            <label>Reliability:</label>
            <StarRating value={reliability} onChange={setReliability} />
          </div>
          <button type="submit" className="review-submit-button">Submit Review</button>
        </form>
      </div>
    </div>
  );
};
interface StarRatingProps {
  value: number | null;
  onChange: (value: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      onClick={() => onChange(i + 1)}
      style={{ cursor: 'pointer', color: value && i < value ? '#FFD700' : '#ddd' }} // Yellow stars
    >
      ★
    </span>
  ));

  return <div>{stars}</div>;
};

export default ReviewModal;

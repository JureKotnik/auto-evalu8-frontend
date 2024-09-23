import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/CarDetailsPage.css';

interface Review {
  id: number;
  comfort: number;
  looks: number;
  reliability: number;
}

interface Comment {
  id: string;
  content: string;
  user: { id: string; username: string } | null; // Make user nullable
}

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  picture?: string | null;
  averageComfort: number;
  averageLooks: number;
  averageReliability: number;
  reviews: Review[];
}

const CarDetailsPage: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/cars/${carId}`);
        const carData = {
          ...response.data,
          reviews: response.data.reviews || [],
        };
        setCar(carData);
      } catch (error) {
        setError('Failed to fetch car details');
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/comments/${carId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    };

    fetchCar();
    fetchComments();
  }, [carId]);

  const handleClose = () => {
    navigate('/');
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment) return;

    try {
      const response = await axios.post(`http://localhost:3000/comments/${carId}`, {
        content: newComment,
      }, { withCredentials: true });

      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment(''); // Clear input field
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };

  if (error) return <p>{error}</p>;
  if (!car) return <p>Loading car details...</p>;

  const placeholderImage = 'https://via.placeholder.com/300x200?text=No+Image+Available';

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={handleClose}>×</button>
        <div className="car-details">
          <h1>{car.make} {car.model} ({car.year})</h1>
          {car.picture ? (
            <img src={`http://localhost:3000/uploads/${car.picture}`} alt={car.make} className="car-image" />
          ) : (
            <img src={placeholderImage} alt="No Image Available" className="car-image" />
          )}

          <h2>Average Ratings</h2>
          <div className="rating-container">
            <p>Comfort: <ReviewStars value={car.averageComfort} /></p>
            <p>Looks: <ReviewStars value={car.averageLooks} /></p>
            <p>Reliability: <ReviewStars value={car.averageReliability} /></p>
          </div>

          <h2>Reviews</h2>
          {car.reviews.length > 0 ? (
            <ul className="reviews-list">
              {car.reviews.map((review) => (
                <li key={review.id} className="review-item">
                  <p>Comfort: {review.comfort}</p>
                  <p>Looks: {review.looks}</p>
                  <p>Reliability: {review.reliability}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Overall: <ReviewStars value={(car.averageComfort + car.averageLooks + car.averageReliability) / 3} /></p>

          )}
        </div>

        <div className="comments-section">
          <h2>Comments</h2>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a comment (You must be logged in to post)"
            />
            {user ? (
              <button type="submit" className="comment-button">Comment</button>
            ) : (
              <p>You must be logged in to post a comment.</p>
            )}
          </form>

          {comments.length > 0 ? (
            <ul className="comments-list">
              {comments.map((comment) => (
                <li key={comment.id} className="comment-item">
                  <strong>{comment.user?.username || 'Anonymous'}:</strong> {comment.content}
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

interface ReviewStarsProps {
  value: number;
}

const ReviewStars: React.FC<ReviewStarsProps> = ({ value }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (i < Math.round(value) ? '★' : '☆'));
  return (
    <span className="stars">
      {stars.join(' ')} ({value.toFixed(1)} / 5)
    </span>
  );
};

export default CarDetailsPage;
 
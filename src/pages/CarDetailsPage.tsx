import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/CarDetailsPage.css';
import ReviewModal from './ReviewModal';

interface Review {
  id: number;
  comfort: number;
  looks: number;
  reliability: number;
}

interface Comment {
  id: string;
  content: string;
  user: { id: string; username: string } | null;
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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCar();
    fetchComments();
  }, [carId]);

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
      const enrichedComments = response.data.map((comment: Comment) => ({
        ...comment,
        user: {
          id: comment.user?.id || '',
          username: comment.user?.username || localStorage.getItem('username') || 'Anonymous', // Get username from local storage
        },
      }));
      setComments(enrichedComments);
    } catch (error) {
      console.error('Failed to fetch comments', error);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment) return;

    const userId = localStorage.getItem('userId'); // Get user ID from local storage

    try {
      const response = await axios.post(`http://localhost:3000/comments/${carId}`, {
        content: newComment,
        userId, // Include userId in the comment submission
      }, { withCredentials: true });

      const newCommentData = {
        ...response.data,
        user: { id: userId, username: localStorage.getItem('username') || 'Anonymous' },
      };

      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };

  const openReviewModal = () => {
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
  };

  const handleReviewSubmitted = () => {
    fetchCar(); // Refresh car data after submitting a review
    closeReviewModal(); // Close the modal
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
            <p>No reviews available.</p>
          )}
          <button className="add-review-button" onClick={openReviewModal}>Add Review</button>
        </div>

        <div className="comments-section">
          <h2>Comments</h2>
          <div className="comments-list-container">
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
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a comment (You must be logged in to post)"
            />
            <button type="submit" className="comment-button">Comment</button>
          </form>
        </div>
      </div>
      
      {showReviewModal && (
        <ReviewModal carId={carId!} onClose={closeReviewModal} onReviewSubmitted={handleReviewSubmitted} />
      )}
    </div>
  );
};

interface ReviewStarsProps {
  value: number;
}

const ReviewStars: React.FC<ReviewStarsProps> = ({ value }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (i < Math.round(value) ? '★' : '☆'));
  return (
    <span className="stars" style={{ color: '#FFD700' }}>
      {stars.join(' ')} ({value.toFixed(1)} / 5)
    </span>
  );
};

export default CarDetailsPage;


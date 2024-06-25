import React, { useState } from 'react';
import axios from 'axios';
import { AiFillStar } from 'react-icons/ai';
import Modal from 'react-modal';

const OrderConfirmation = () => {
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tips, setTips] = useState('');

  const handleConfirmOrder = () => {
    // Logic for confirming the order
    // ...

    // After confirming the order, show the review popup
    setShowReviewPopup(true);
  };

  const handleSubmitReview = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const restaurantId = localStorage.getItem('restaurantId');
      const orderId = 'your-order-id'; // Replace with actual order ID

      const reviewData = {
        comment,
        note: rating,
        restaurantFK: restaurantId,
        orderFK: orderId,
      };

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/avis/${userId}`, reviewData);
      setShowReviewPopup(false);
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div>
      <button onClick={handleConfirmOrder}>Confirm Order</button>
      <Modal isOpen={showReviewPopup} onRequestClose={() => setShowReviewPopup(false)}>
        <h2>Tell us about your experience?</h2>
        <div>
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <AiFillStar
                key={index}
                onClick={() => setRating(index + 1)}
                color={index < rating ? 'orange' : 'grey'}
              />
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Please write your comment here..."
          />
          <div>
            <h3>Leave a tip?</h3>
            <button onClick={() => setTips('5$')}>5$</button>
            <button onClick={() => setTips('10$')}>10$</button>
            <button onClick={() => setTips('15$')}>15$</button>
            <input
              type="text"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="Other"
            />
          </div>
          <button onClick={handleSubmitReview}>Submit</button>
        </div>
      </Modal>
    </div>
  );
};

export default OrderConfirmation;

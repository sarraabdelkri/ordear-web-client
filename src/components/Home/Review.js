import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import backgroundImage from '../../assets/body-bg.jpg';

const Review = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getReviewsByUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/avis/getAvisByUser`, { withCredentials: true });

        if (!response.data) {
          throw new Error('Failed to fetch reviews');
        }

        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error.message);
      }
    };

    getReviewsByUser();
  }, []);

  return (
    <section className="pride" style={{ backgroundImage: `url(${backgroundImage})`, marginTop: 0 }}>
      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="text-center">
            <h1 className="mb-5">Our Clients Say!!!</h1>
          </div>
          <div className="row">
          
              <div className="col-md-6 col-lg-4 mb-4">
                <div className="card testimonial-card border rounded p-4">
                  <div className="card-body">
                    <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                    <p className="card-text">ddd</p>
                    <div className="d-flex align-items-center">
                      <img className="img-fluid flex-shrink-0 rounded-circle" src="img/testimonial-1.jpg" style={{ width: "50px", height: "50px" }} alt="Client" />
                      <div className="ps-3">
                        <h5 className="mb-1">dddd</h5>
                        <small>ddd</small>
                      </div>
                    </div>
                    <div className="rating mt-3">
                      <p>Rating: rating</p> {/* Affichage de l'évaluation */}
                      {/* <div>
                        {[...Array(review.rating)].map((star, index) => (
                          <FaStar key={index} color="#ffc107" size={20} /> // Affichage des étoiles en fonction de l'évaluation
                        ))}
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Review;

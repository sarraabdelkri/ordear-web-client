import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { AiFillStar } from 'react-icons/ai';
import styles from './Testimonials.module.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SubHeading from "../../Menu/SubHeading";
import background from '../../../assets/backgroundreview.jpg';
const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const restaurantId = localStorage.getItem('restaurantId');

  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!restaurantId) {
        setError('Restaurant ID is missing');
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/avis/restaurant/${restaurantId}`);
        setTestimonials(response.data);
        setError(null);
      } catch (error) {
        setError(error.message || 'Error fetching testimonials');
      }
      setLoading(false);
    };

    fetchTestimonials();
  }, [restaurantId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error}
        <button onClick={() => setTestimonials([])}>Retry</button>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return <div>No testimonials found.</div>;
  }

  const sliderSettings = {
    dots: false,  // Set to false to hide the dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
};


  return (
    <div className={styles['testimonials-section']}>
        <SubHeading title="Testimonials"   />
                  <div style={{ 
              backgroundImage: `url(${background})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              height: "auto"  // Adjusted to a specific pixel value
            }}>
                <h1 style={{fontSize:"150%",paddingTop:"5%"}} >
            Discover what our customers have to say about their Dining experiences
          </h1>
          <p style={{ color: 'white' }}>
            Our guests share their thoughts on our cuisine, service, and ambiance. Read their reviews and find out why our restaurant is a favorite among food lovers.
          </p>


      <Slider {...sliderSettings} className={styles['testimonials-container']}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className={styles['testimonial-item']}>
            {testimonial.user && testimonial.user.image && (
              <img src={`http://localhost:5555/uploads/user/${testimonial.user.image}`} alt={`${testimonial.user.firstName} ${testimonial.user.lastName}`} />
            )}
            <h3>{testimonial.user ? `${testimonial.user.firstName} ${testimonial.user.lastName}` : 'Anonymous'}</h3>
            <p className={styles.position}>{testimonial.user ? testimonial.user.position : ''}</p>
            <p>{testimonial.comment}</p>
            <div className={styles.stars}>
              {[...Array(testimonial.note)].map((_, i) => (
                <AiFillStar key={i} />
              ))}
            </div>
            <p className={styles.date}>{new Date(testimonial.date).toLocaleDateString()}</p>
          </div>
        ))}
      </Slider>
      </div>
    </div>
  );
};

export default Testimonials;                                            

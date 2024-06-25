import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// This will use the uploaded image
import { BsFillPlayCircleFill } from "react-icons/bs";
import SubHeading from "../../Menu/SubHeading";

const About = () => {
  const [restaurantData, setRestaurantData] = useState(null);
  const { restaurantId } = useParams();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/restaurant/retrieve/${restaurantId}`);
        setRestaurantData(response.data);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    };
    fetchRestaurant();
  }, [restaurantId]);

  return (
    <div style={{ margin: "0 auto", maxWidth: "1200px", padding: "20px" }}>
      {restaurantData && (
        <div className="app__specialMenu flex__center section__padding" id="menu">
          <div className="app__specialMenu-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <SubHeading title="About Us" />
          </div>
        </div>
      )}

      <div className="about-section-container" style={{ marginTop: "5px", display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="about-section-image-container" style={{ flex: '1', position: 'relative' }}>
          <img src={restaurantData && restaurantData.images ? restaurantData.images : "white"} alt="About Background" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
        </div>
        
        <div className="about-section-text-container" style={{ flex: '1', padding: '20px',marginLeft:"-20%" }}>
          <h1 className="primary-heading" style={{ fontSize: '36px', marginBottom: '20px', color: '#333' }}>
            Who Are We?
          </h1>
          <p className="primary-text" style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
            We help people enjoy incredible dining experiences and superior coffee. Our goal is to provide outstanding and captivating service.
          </p>
          <p className="primary-text" style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', marginBottom: '40px' }}>
            We are a fast-growing restaurant and coffee shop chain, committed to our core values of quality, innovation, and customer satisfaction. We are always exploring new ways to improve our offerings and enhance our customers' experiences.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button className="secondary-button" style={{ color: "white", backgroundColor: "#FA8072", padding: '10px 20px', borderRadius: '5px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Learn More</button>
            <button className="watch-video-button" style={{ padding: '10px 20px', borderRadius: '5px', border: '1px solid #FA8072', backgroundColor: 'transparent', color: '#FA8072', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <BsFillPlayCircleFill style={{ marginRight: '10px' }} /> Watch Video
            </button>
          </div>
        </div>
      </div>

      <div className="about-section-features" style={{ display: 'flex', justifyContent: 'space-around', marginTop: '60px', padding: '0 20px' }}>
        <div className="feature" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', color: '#007BFF' }}>☕</div>
          <h3>Versatile Menu</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>Our menu caters to all tastes, from gourmet dishes to exquisite coffee blends.</p>
        </div>
        <div className="feature" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', color: '#007BFF' }}>🍽️</div>
          <h3>Exceptional Service</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>We strive to provide the best dining and coffee experiences through excellent service and ambiance.</p>
        </div>
      </div>
    </div>
  );
};

export default About;

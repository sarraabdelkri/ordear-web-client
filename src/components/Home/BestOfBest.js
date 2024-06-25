import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom'; 
import { AiOutlineArrowRight } from 'react-icons/ai';
import backgroundImage from "../../assets/body-bg.jpg";
// Slider settings
const settings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 1500,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  cssEase: "linear",
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

function BestOfBest() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    axios.get('https://backend.themenufy.com/restaurant/retrieveAll')
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => console.error('Error fetching restaurants:', error));
  }, []);

  return (
    <section className="py-3 py-md-5 py-xl-8" style={{ backgroundImage: `url(${backgroundImage})`, marginTop: 0 }}>
      <div className="container">
      <div className="col-md-8 offset-md-2">
          <div className="mt-4 d-flex justify-content-center align-items-center mt-4">
          <h1 className="" >
         Our Partners    </h1>
        </div>
        <div className="d-flex justify-content-center align-items-center text-center">
          <div className="row">
            <div
              className="col-12 text-center mt-3"
              style={{ border: "1px solid black", width: 160 }}
            ></div>
          </div>
        </div>
            <br />
         
            <p className="mb-5 text-center">At Menu, we offer more than just great food. We strive to create an exceptional dining experience that goes beyond the ordinary. Here's why you should choose us:</p>
          </div>
        <div className="row mt-5">
          <Slider {...settings}>
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className="text-center p-4">
                
                 <img src={`https://backend.themenufy.com/uploads/resto/${restaurant.logo}`}   style={{
                    width: '100%', // Ensures image takes full width of the container
                    height: '200px', // Fixed height for all images
                    objectFit: 'cover', // Ensures the image covers the area without distorting aspect ratio
                    borderRadius: '15px', // Keeps your rounded corners
                    cursor: 'pointer' // Cursor indicates clickable items
                  }} onClick={() => navigate(`/search/${restaurant._id}`)} />
            

              </div>
            ))}
          </Slider>
        </div>
        <div className="mt-5 d-flex justify-content-center">
          <button className="button-30" style={{ backgroundColor: "#FA8072", border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
            Voir plus <AiOutlineArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}

export default BestOfBest;

import React from "react";
import AboutBackground from "../../../assets/about-background.png";
import AboutBackgroundImage from "../../../assets/about-background-image.png";
import { BsFillPlayCircleFill } from "react-icons/bs";
import SubHeading from "../../Menu/SubHeading";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
    <div>
      {restaurantData && (
        <div className="app__specialMenu flex__center section__padding" id="menu">
          <div className="app__specialMenu-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <SubHeading title="About Us" />
          </div>
        </div>
      )}

      <div className="about-section-container" style={{ marginTop: "100px" }}>
        <div className="about-background-image-container">
          
        </div>
        <div className="about-section-image-container">
        <img src={restaurantData && restaurantData.images} alt="" style={{width:"80%",marginLeft:"30px"}} />
        </div>
        <div className="about-section-text-container">
          <h1 className="primary-heading">
            Food Is An Important Part Of A Balanced Diet
          </h1>
          <p className="primary-text">
            Lorem ipsum dolor sit amet consectetur. Non tincidunt magna non et
            elit. Dolor turpis molestie dui magnis facilisis at fringilla quam.
          </p>
          <p className="primary-text">
            Non tincidunt magna non et elit. Dolor turpis molestie dui magnis
            facilisis at fringilla quam.
          </p>
          <div className="about-buttons-container">
            <button className="secondary-button" style={{ color: "white", backgroundColor: "#FA8072" }}>Learn More</button>
            <button className="watch-video-button">
              <BsFillPlayCircleFill /> Watch Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
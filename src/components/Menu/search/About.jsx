import React, { useState, useEffect ,useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SubHeading from "../../Menu/SubHeading";
import backgroundImage from '../../../assets/full-bg.png'
import { toast } from 'react-toastify';
import styles from '../../Menu/search/aboutUs.module.css';
import images from "../../../assets/about-img.png";
import BannerBackground from "../../../assets/about-background.png";
import BannerImage from "../../../assets/restaurant-gallery-1.jpg";
import Navbar from "../search/Navbar";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";
import logo from "../../../assets/logo545.png";
import { BsCart2 } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Nav } from "reactstrap";
import './aboutUs.module.css';

function About() {
  const { restaurantId } = useParams();
  const [restaurantData, setRestaurantData] = useState(null);

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

  const lightenColor = (color) => {
    // Convertir la couleur hexadécimale en RGB
    const rgb = parseInt(color.substring(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;
  
  
    const newR = Math.min(r + 50, 255); 
    const newG = Math.min(g + 50, 255); 
    const newB = Math.min(b + 50, 255);
  
    
    const newColor = "#" + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);
  
    return newColor;
  };
  return (
    <div>
      {restaurantData && (
        <div className="home-container" style={{ backgroundImage: `url(${backgroundImage})`, marginTop: 0 }}>
          <Navbar />
          <div className="home-banner-container">
            <div className="home-text-section">
              <h1 className="primary-heading">
                The Key To Fine Dining in {restaurantData.nameRes}
              </h1>
              <p className="primary-text">{restaurantData.cuisineType} cuisine</p>
             
                <FontAwesomeIcon icon={faMapMarkerAlt} className="address-icon" />
                <p className="primary-textt">{restaurantData.address}</p>
             
              <button className="secondary-button">
                Order Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
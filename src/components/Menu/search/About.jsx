import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import Navs from "../../Navs/Navs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './aboutUs.module.css';  // Assurez-vous de créer ce fichier CSS pour les styles spécifiques

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
        toast.error('Error fetching restaurant details');
      }
    };
    fetchRestaurant();
  }, [restaurantId]);

  return (
    <div>
       <Navs />
      {restaurantData && (
        <div className={styles.homeContainer} style={{ backgroundImage: `url(${restaurantData.images})`, marginTop: 0 }}>
         
          <div className={styles.homeBannerContainer}>
            <div className={styles.homeTextSection}>
              <div className={styles.logoContainer}>
                <img src={`https://backend.themenufy.com/uploads/resto/${restaurantData.logo}`}alt="Logo" className={styles.logo} />
              </div>
              <h1 className={styles.primaryHeading}>
                The Key To Fine Dining in {restaurantData.nameRes}
              </h1>
              <p className={styles.primaryText}>{restaurantData.cuisineType} cuisine</p>
              <div className={styles.addressContainer}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.addressIcon} />
                <p className={styles.primaryText}>{restaurantData.address}</p>
              </div>
              <button className={styles.secondaryButton}>
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

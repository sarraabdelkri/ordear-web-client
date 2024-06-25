import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Navs from "../../Navs/Navs";
import Footer from '../../Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import styles from './ReclamationList.module.css';

const ReclamationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/reclamation/reclamation/user/${userId}`);
        setNotifications(response.data);
      } catch (error) {
        setError('Failed to fetch notifications');
      }
    };

    fetchReclamations();
  }, [userId]);

  return (
    <>
      <Navs />
      <div className={styles.notificationsContainer}>
        <h2 className={styles.title}><FontAwesomeIcon icon={faBell} /> Claims</h2>
        {error && <p className={styles.error}>{error}</p>}
        {notifications.map((notification, index) => (
          <div key={index} className={styles.notificationItem}>
            <div className={styles.notificationHeader}>
              <img 
                src={`http://localhost:5555/uploads/reclamation/${notification.image}`}  
                alt={notification.restaurantFK.nameRes} 
                className={styles.notificationImage} 
              />
              <div className={styles.notificationTitleContainer}>
                <h3 className={styles.notificationTitle}>{notification.restaurantFK.nameRes}</h3>
              </div>
            </div>
            <div className={styles.notificationBody}>
              <h3 className={styles.notificationType}>{notification.type}</h3>
              <p className={styles.notificationMessage}>{notification.message}</p>
              <span className={styles.notificationDate}>{notification.date}</span>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default ReclamationList;

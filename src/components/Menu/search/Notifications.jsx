import React, { useState, useEffect } from 'react';
import styles from './Notifications.module.css'; // Ensure you have corresponding CSS for styles
import Navs from  '../../Navs/Navs';
import Footer from '../../Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Fetching userId from localStorage
    if (!userId) {
      setError('User ID not found');
      return;
    }
    setIsLoading(true);
    fetchNotifications(userId)
      .then(data => {
        setNotifications(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(`Failed to fetch notifications: ${err.message}`);
        setIsLoading(false);
      });
  }, []);

  const fetchNotifications = async (userId) => {
    const url = `http://localhost:5555/notification/notifications/${userId}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch notifications');
    }
  };

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <>
    <Navs />
    <div className={styles.notificationsContainer}>
    <h2><FontAwesomeIcon icon={faBell} /> Notifications</h2>
      {notifications.length > 0 ? notifications.map((notification, index) => (
        <div key={index} className={styles.notificationItem}>
        {notification.orderFK.map((order, orderIndex) => (
            <div key={orderIndex} className={styles.orderItem}>
              <img src={order.restaurantFK.images} alt={order.restaurantFK.nameRes} className={styles.notificationImage} />
              <div className={styles.notificationText}>
                <h3 className={styles.notificationTitle}>{order.restaurantFK.nameRes}</h3>
              </div>
            </div>
          ))}
          <div className={styles.notificationText}>
            <h3 className={styles.notificationTitles}>{notification.title}</h3>
            <p className={styles.notificationBody}>{notification.body}</p>
            <span className={styles.notificationTime}>{notification.date}</span>
          </div>
          
        </div>
      )) : <p className={styles.noNotifications}>No notifications found.</p>}
    </div>
    <Footer/>
    </>
  );
};

export default Notifications;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheckCircle, faTimesCircle, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import backgroundImage from '../../assets/body-bg.jpg';
import './Order.module.css';  // Make sure your CSS handles the card sizing properly
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Orders = () => {
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/order/get/all/By/user`, { withCredentials: true });
        console.log("Orders fetched:", response.data);
        if (response.data && response.data.length > 0) {
          const uniqueOrders = new Map();
          response.data.forEach(order => {
            uniqueOrders.set(order._id, order);
          });
          setOrderList(Array.from(uniqueOrders.values()));
        } else {
          console.log("No orders or error in data structure");
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const settings = {
    dots: true,
    infinite: false, // Change this to false to prevent infinite looping which could also confuse users when seeing duplicates
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 768,  // Adjust this if needed
        settings: {
          slidesToShow: 1  // Show one card at a time on mobile devices
        }
      }
    ]
  };

  return (
    <section className="pride" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="container">
        <h1 className="text-center mb-4">Recent Orders</h1>
        <Slider {...settings}>
          {orderList.map(order => (
            <div key={order._id} className="px-3">
              <Link to={`/orderdetails/${order._id}`}>
              <div className="card" style={{ width: "250px" }}>
                <div className="card-header" style={{ backgroundColor: order.statusOrder === 'Canceled' ? '#ffcccc' : '#ccffcc' }}>
                  <FontAwesomeIcon icon={order.statusOrder === 'Canceled' ? faTimesCircle : faCheckCircle} className="mr-2" />
                  {order.statusOrder}
                </div>
                <div className="card-body" style={{ textAlign: 'center' }}>  
                  <img src={order.restaurantFK.images} alt={order.restaurantFK.nameRes} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                  <h5>{order.restaurantFK.nameRes}</h5>
                  <p>Order N°: {order.orderNb}</p>
                  <p>
                    <FontAwesomeIcon icon={faMoneyBill} style={{ color: 'green' }} /> ${order.totalPrice}
                  </p>
                </div>
              </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Orders;

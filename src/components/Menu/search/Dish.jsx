import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Link } from 'react-router-dom';
import './Dish.css'; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useSelector, useDispatch } from 'react-redux';
import { wishlistActions } from '../../../store/wishlistSlice';

function Dish({ product }) {
  const [dish, setDish] = useState(product);
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const restaurantId = useSelector(state => state.restaurant.restaurantId);
  const tableNb = useSelector(state => state.restaurant.tableNb);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userId = useSelector(state => state.auth.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to update your wishlist.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/product/users/${userId}/wishlist/${dish._id}`,
        { isFavorited: !dish.isFavorited },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const updatedIsFavorited = !dish.isFavorited;
        setDish(prevDish => ({ ...prevDish, isFavorited: updatedIsFavorited }));
        dispatch(wishlistActions.toggleWishlist({ ...dish, isFavorited: updatedIsFavorited }));
        toast.success(updatedIsFavorited ? "Added to wishlist!" : "Removed from wishlist!");
      } else {
        throw new Error('Failed to update wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error("Error updating wishlist.");
    }
  };
  
  const addToCart = async () => {
    if (!dish) {
      toast.error('Dish details not available');
      return;
    }

    const userId = localStorage.getItem("userId");
    const userPass = userId || "000000000000000000000000";
    const storedRestaurantId = localStorage.getItem('restaurantId');

    if (!storedRestaurantId) {
      console.error('Restaurant ID is missing');
      toast.error('Restaurant ID is missing');
      return;
    }

    console.log('Adding product to cart:', dish); // Log the product being added to the cart

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/cart/addtocartweb/${userPass}`,
        {
          productFK: dish._id,
          quantity: 1,
          restaurantFK: storedRestaurantId,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Product added to cart!");
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error(error.message || "An error occurred while adding product to cart");
    }
  };

  return (
    <div className="containers my-5">
      {dish && (
        <div className="cards">
          <div className="card-headers bg-transparent">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FontAwesomeIcon
                icon={dish.isFavorited ? solidHeart : regularHeart}
                onClick={handleFavoriteClick}
                style={{ color: dish.isFavorited ? 'red' : 'gray', cursor: 'pointer' }}
              />
              <span>Today's Offer</span>
              {dish.promotion > 0 && (
                <span className="text-danger">{dish.promotion}%</span>
              )}
            </div>
          </div>
          <div className="card-bodys">
            <img src={dish.photo} alt={dish.name} className="img-fluid" />
            <h5>{dish.name.toUpperCase()}</h5>
            <p>${dish.price}</p>
            <p>Description: {dish.description}</p>
            <div className="btn-group">
              <button style={{ color: 'white', background: 'salmon' }} onClick={addToCart}>Add to cart</button>
              <Link to={`/dish-details/${dish._id}`} className="btn btn-link" style={{ color: 'salmon' }}>Details</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dish;

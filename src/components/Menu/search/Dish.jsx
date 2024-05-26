import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faHeart as regularHeart } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import './Dish.css'; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { useSelector, useDispatch } from 'react-redux';
import { wishlistActions } from '../../../store/wishlistSlice';

function Dish({ product }) {
  const [dish, setDish] = useState(product);
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const restaurantId = useSelector(state => state.restaurant.restaurantId);
  const tableNb = useSelector(state => state.restaurant.tableNb);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userId = useSelector(state => state.auth.userId); // Récupérer le userId depuis le state auth
  const dispatch = useDispatch();

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddToCart = async () => {
    if (!dish) {
      toast.error('Dish details not available');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/cart/addproduct`, {
        productFK: dish._id,
        quantity,
        restaurantFK: restaurantId,
        tableNb: tableNb,
      }, { withCredentials: true });

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

  const handleFavoriteClick = async () => {
    console.log('Adding to wishlist:', dish._id); // Log the product ID
    console.log('User ID:', userId); // Log the user ID

    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/product/users/${userId}/wishlist/${dish._id}`, {}, { withCredentials: true });
      console.log('Response from server:', response); // Log the server response

      if (response.status === 200) {
        setDish(prevDish => ({ ...prevDish, isFavorited: !prevDish.isFavorited }));
        dispatch(wishlistActions.addToWishlist(dish));
        toast.success("Product added to wishlist!");
      } else {
        throw new Error('Failed to add product to wishlist');
      }
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
      toast.error(error.message || "An error occurred while adding product to wishlist");
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768, 
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="container my-5">
      {dish && (
        <div className="card mb-3" style={{ maxWidth: isMobile ? '100%' : '300px', margin: 'auto' }}>
          <div className="card-header bg-transparent">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FontAwesomeIcon
                icon={dish.isFavorited ? solidHeart : regularHeart}
                style={{ color: 'red' }}
                onClick={handleFavoriteClick}
              />
              <span>Today's Offer</span>
              {dish.promotion > 0 && (
                <span className="text-danger">{dish.promotion}%</span>
              )}
            </div>
          </div>
          <div className="card-body">
            <img src={dish.photo} alt={dish.name} className="img-fluid" style={{ marginBottom: '10px', width: "70%", alignContent: "center" }} />
            <h5>{dish.name.toUpperCase()}</h5>
            <p>${dish.price}</p>
            <p>Description: {dish.description}</p>
            <div className="btn-group" style={{ width: '100%' }}>
              <button style={{ color: 'white', background: 'salmon' }} onClick={handleAddToCart}>Add to cart</button>
              <Link to={`/dish-details/${dish._id}`} className="btn btn-link" style={{ color: 'salmon' }}>Details</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dish;

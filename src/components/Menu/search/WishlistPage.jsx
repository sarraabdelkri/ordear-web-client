import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { wishlistActions } from '../../../store/wishlistSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navs from "../../Navs/Navs";
import Footer from "../../Footer/Footer";
import './WishlistPage.css'; // Assurez-vous de créer ce fichier CSS

const WishlistPage = () => {
  const wishlistItems = useSelector(state => state.wishlist.items);
  const restaurantId = useSelector(state => state.restaurant.restaurantId);
  const tableNb = useSelector(state => state.restaurant.tableNb);
  const userId = useSelector(state => state.auth.userId); // Récupérer le userId depuis le state auth
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/product/users/${userId}/wishlist`, { withCredentials: true });
        if (response.status === 200) {
          dispatch(wishlistActions.setWishlist(response.data));
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    fetchWishlist();
  }, [dispatch, userId]);

  const handleAddToCart = async (item) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/cart/addproduct`, {
        productFK: item._id,
        quantity: 1, // Vous pouvez ajuster la quantité selon vos besoins
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

  return (
    <div>
      <Navs></Navs>
      <div className="wishlist-page container my-5"  >
        <h2 style={{marginTop: "150px"}}>Your WishList</h2>
        {wishlistItems.length > 0 ? (
          <ul className="list-unstyled wishlist-list">
            {wishlistItems.map(item => (
              <li key={item._id} className="wishlist-item">
                <div className="card">
                  <div className="card-header bg-transparent">
                    <span>Today's Offer</span>
                    {item.promotion > 0 && (
                      <span className="text-danger">{item.promotion}%</span>
                    )}
                  </div>
                  <div className="card-body">
                    <img src={item.photo} alt={item.name} className="img-fluid" />
                    <h5>{item.name.toUpperCase()}</h5>
                    <p>${item.price}</p>
                    <p>Description: {item.description}</p>
                    <div className="btn-group">
                      <button style={{ color: 'white', background: 'salmon' }} onClick={() => handleAddToCart(item)}>Add to cart</button>
                      <Link to={`/dish-details/${item._id}`} className="btn btn-link" style={{ color: 'salmon' }}>Details</Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your wishlist is empty</p>
        )}
      </div>
      <Footer></Footer>
    </div>
  );
};

export default WishlistPage;

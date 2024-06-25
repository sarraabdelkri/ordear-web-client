import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../Footer/Footer';
import Navbar from '../../Navs/Navs';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './DishDetails.css';

function DishDetails(props) {
  const { productId } = useParams();
  const [dish, setDish] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientItems, setIngredientItems] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const navigate = useNavigate();
  const restaurantId = useSelector(state => state.restaurant.restaurantId);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/product/products/${productId}/similar`);
        setSimilarProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching similar products:', error);
        toast.error('Failed to fetch similar products.');
      }
    };
    fetchSimilarProducts();
  }, [productId]);

  useEffect(() => {
    try {
      const tokenLoginString = localStorage.getItem("tokenLogin");
      if (tokenLoginString) {
        const user = JSON.parse(tokenLoginString);
        if (user && user._id) {
          setUserId(user._id);
        } else {
          console.error("User object does not have ID.");
          toast.error("User data is malformed.");
        }
      } else {
        console.error("User not authenticated.");
       
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
     
    }
  }, []);

  useEffect(() => {
    const fetchDishDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/product/find/item/${productId}`);
        setDish(response.data);
      } catch (error) {
        console.error('Error fetching dish details:', error);
      }
    };
    fetchDishDetails();
  }, [productId]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/ingredient/retrieve/disponible/ingredient/by/Product/${productId}`);
        setSelectedIngredients(response.data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };
    fetchIngredients();
  }, [productId]);

  useEffect(() => {
    const fetchIngredientItems = async (ingredientId) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/item/retrieve/visible/item/by/ingredient/${ingredientId}`);
        setIngredientItems(prevItems => ({
          ...prevItems,
          [ingredientId]: response.data
        }));
      } catch (error) {
        console.error(`Error fetching items for ingredient ${ingredientId}:`, error);
      }
    };

    selectedIngredients.forEach(ingredient => {
      fetchIngredientItems(ingredient._id);
    });
  }, [selectedIngredients]);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIngredientToggle = (ingredient) => {
    // Logic to handle ingredient selection
  };

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    const userPass = userId || "000000000000000000000000";
    const storedRestaurantId = localStorage.getItem('restaurantId');

    if (!storedRestaurantId) {
      console.error('Restaurant ID is missing');
      toast.error('Restaurant ID is missing');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/cart/addtocartweb/${userPass}`,
        {
          productFK: productId,
          quantity: 1,
          restaurantFK: storedRestaurantId,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Product added to cart!");
        const updatedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = updatedCartItems.findIndex(item => item._id === productId);
        if (existingItemIndex !== -1) {
          updatedCartItems[existingItemIndex].quantity += 1;
        } else {
          updatedCartItems.push({ _id: productId, name: dish.name, price: dish.price, photo: dish.photo, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        console.log('Adding product to cart:', dish);
        const cartId = response.data.cartId; // Ensure correct key from response
        if (cartId) {
          console.log('Cart ID:', cartId);
          localStorage.setItem('cartTrash', cartId);
        }
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error(error.message || "An error occurred while adding product to cart");
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  if (!dish) {
    return <div>Loading...</div>;
  }

  const { name, photo, description, price, promotion } = dish;

  const ingredientsStyle = {
    listStyle: 'none',
    paddingLeft: 0,
  };

  const checkboxStyle = {
    marginRight: '10px',
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="row" style={{marginTop: "150px"}}>
          <div className="col-md-6">
            <div className="images p-3">
              <div className="text-center p-4">
                <img id="main-image" alt="product" src={photo} width="200" style={{ marginTop: "50px" }} />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="main-description px-4">
              <h5 className="text-uppercase" style={{ color: "salmon", fontSize: "25px", fontWeight: "bold" }}>
                {name}
              </h5>
              <p className="display-6">${price}</p>
              {promotion > 0 && (
                <p className="promotion text-danger" style={{fontSize:"20px"}}>
                  Save {promotion}%!
                </p>
              )}
              <ul style={ingredientsStyle} className="ingredients">
                {selectedIngredients.map(ingredient => (
                  <li key={ingredient._id}>
                    <div>
                      <p className="ingredients-title mb-1" style={{ fontWeight: 'bold' }}>Ingredients</p>
                      {ingredientItems[ingredient._id] && (
                        <ul style={{ marginLeft: '20px' }}>
                          {ingredientItems[ingredient._id].map(item => (
                            <div key={item._id}>
                              <input
                                type="checkbox"
                                id={item._id}
                              />
                              <label htmlFor={item._id}>{item.title} : ${item.price}</label>
                            </div>
                          ))}
                        </ul>
                      )}
                      <input
                        type="checkbox"
                        style={checkboxStyle}
                        id={ingredient._id}
                        checked={selectedIngredients.includes(ingredient)}
                        onChange={() => handleIngredientToggle(ingredient)}
                      />
                      <label htmlFor={ingredient._id}>
                        {ingredient.type} : ${ingredient.price}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="ingredients-title mb-1" style={{ fontWeight: 'bold' }}>Description</p>
              <p className="description mb-4" style={{ fontSize: '1.2rem', color: 'grey' }}>{description}</p>
              <div className="buttons d-flex align-items-center">
                <div style={{ marginRight: '1rem' }}>
                  <FontAwesomeIcon icon={faHeart} style={{ color: "salmon" ,fontSize: "24px" }} />
                </div>
                <div className="block mr-3">
                  <button className="shadow btn custom-btn" style={{ backgroundColor: "salmon" }} onClick={handleAddToCart}>
                    <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container my-5">
        <h2 className="display-5 mb-4">Similar Products</h2>
        <Slider {...settings}>
          {similarProducts.length > 0 ? (
            similarProducts.map(product => (
              <div key={product._id} className="text-center">
                <img 
                  src={product.photo} 
                  alt={product.name} 
                  className="similar-product-image" 
                  onClick={() => navigate(`/dish-details/${product._id}`)}
                />
                <h5>{product.name}</h5>
                <p>${product.price}</p>
              </div>
            ))
          ) : (
            <p>No similar products found.</p>
          )}
        </Slider>
      </div>
      <Footer />
    </>
  );
}

export default DishDetails;

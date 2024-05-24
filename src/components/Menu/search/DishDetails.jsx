import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../Footer/Footer';
import Navbar from './Navbar';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { useDispatch } from 'react-redux';
import { incrementWishlistCount } from '../../../store/wishlistSlice';
import { cartActions } from '../../../store/cartSlice';
import { Link } from 'react-router-dom';
import { faStar as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faStar as solidHeart } from '@fortawesome/free-solid-svg-icons';
import './DishDetails.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useSelector } from "react-redux";
function DishDetails(props) {
    const { productId } = useParams();
    const [dish, setDish] = useState(null);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [ingredientItems, setIngredientItems] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [cartItemsCount, setCartItemsCount] = useState(0); // State to track total items in cart
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [items, setItems] = useState([]);
    const [listItems, setListItems] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);  
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();
    const restaurantId = useSelector(state => state.restaurant.restaurantId);
    const tableNb = useSelector(state => state.restaurant.tableNb);

    const settings = {
        dots: true, // Affiche les points de navigation en bas du carrousel
        infinite: true, // Le carrousel boucle indéfiniment
        autoplay: true, // Active le défilement automatique
        autoplaySpeed: 1500, // Vitesse du défilement automatique (en ms)
        speed: 500, // Vitesse de transition entre les diapositives
        slidesToShow: 3, // Nombre de diapositives à afficher en même temps
        slidesToScroll: 1, // Nombre de diapositives à défiler
        cssEase: "linear", // Type d'animation de transition
        responsive: [ // Réglages responsives
          {
            breakpoint: 768, // À 768px et moins
            settings: {
              slidesToShow: 1, // Afficher 1 diapositive à la fois
            },
          },
        ],
      };
      const buttonRef = useRef(null);

      const enableButton = () => {
        buttonRef.current.disabled = false;
      };
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
            // Retrieve user details from localStorage
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
                toast.error("No user data found.");
            }
        } catch (error) {
            console.error("Failed to parse user data:", error);
            toast.error("Failed to parse user data.");
        }
    }, []);

    const handleWishlistClick = async () => {
        if (!userId) {
            console.error("User ID is undefined.");
            toast.error("User not authenticated.");
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/product/users/${userId}/wishlist/${productId}`);
            if (response.status === 200) {
                dispatch(incrementWishlistCount());
                toast.success('Product added to wishlist!');
            } else {
                throw new Error('Failed to add product to wishlist');
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            toast.error('Failed to add to wishlist');
        }
    };

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

    // Other useEffect hooks for fetching ingredients and ingredient items...

    
    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/ingredient/retrieve/disponible/ingredient/by/Product/${productId}`);
                setSelectedIngredients(response.data);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };
        fetchIngredients();
    }, [productId]);
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser._id) {
            setUser(storedUser);
        } else {
            console.log("No user found in localStorage.");
            toast.error("User not authenticated.");
        }
    }, []);

    // A second useEffect depending on user and productId
    useEffect(() => {
        if (user && user._id) {
            console.log("User is set:", user);
            // You can also fetch dish details here if it depends on user being set
        }
    }, [user, productId]); // Correct dependencies
    useEffect(() => {
        const fetchIngredientItems = async (ingredientId) => {
            try {
                const response = await axios.get(`http://localhost:5555/item/retrieve/visible/item/by/ingredient/${ingredientId}`);
                setIngredientItems(prevItems => ({
                    ...prevItems,
                    [ingredientId]: response.data
                }));
            } catch (error) {
                console.error(`Error fetching items for ingredient ${ingredientId}:`, error);
            }
        };

        // Fetch items for each selected ingredient
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
        // Logique pour gérer la sélection des ingrédients
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < Math.floor(rating); i++) {
            stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-warning" />);
        }
        return stars;
    };
    const handleAddToCart = async () => {
        
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/cart/addProdductToCart`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                restaurantFK: restaurantId,
                tableNb: tableNb,
                productFK: productId,
                ingredientFK: [selectedIngredient] || [],
                itemsFK: listItems.map((el) => items.find((e) => e._id == el)?._id),
              }),
            }
          );
          const responseData = await response.json();
          
          if (!response.ok) {
            if (response.status === 200) {
                toast.success("Product added to cart!");
            } else {
                throw new Error('Failed to add product to cart');
            }
        }
    };
    
    

      
    
    if (!dish) {
        return <div>Loading...</div>;
    }

    const { name, photo, description, price, promotion } = dish;

    // Styles CSS en ligne
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
                <div className="row">
                    {/* Colonne pour l'image principale */}
                    <div className="col-md-6">
                        <div className="images p-3">
                            <div className="text-center p-4">
                                <img id="main-image" alt="product" src={photo} width="200" style={{ marginTop: "50px" }} />
                            </div>
                        </div>
                    </div>
                    {/* Colonne pour les détails du plat */}
                    <div className="col-md-6">
                        <div className="main-description px-4">
                            <h5 className="text-uppercase" style={{ color: "salmon", fontSize: "25px", fontWeight: "bold" }}>
                                {name}
                            </h5>
                            <p className="display-6">${price}</p>
                            {promotion > 0 && (
                            <p className="promotion text-danger" style={{fontSize:"20px"}} >
                            Save {promotion}%!
                            </p>
                            )}
                            {/* <p className="rating"> {renderStars(promotion)}</p> */}
                           
                            {/* Liste des ingrédients avec des cases à cocher */}
                            <ul style={ingredientsStyle} className="ingredients">
                                {selectedIngredients.map(ingredient => (
                                    <li key={ingredient._id}>
                                        <div>
                                            <p className="ingredients-title mb-1" style={{ fontWeight: 'bold' }}>Ingredients</p>
                                            {/* Afficher les items correspondant à cet ingrédient */}
                                            {ingredientItems[ingredient._id] && (
                                                <ul style={{ marginLeft: '20px' }}>
                                                    {ingredientItems[ingredient._id].map(item => (
                                                        <div key={item._id}>
                                                            <input
                                                                type="checkbox"
                                                                id={item._id}
                                                                // Ajoutez ici la logique pour gérer la sélection des items
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
                                               
                                                {ingredient.type} :  ${ingredient.price}
                                            </label>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <p className="ingredients-title mb-1" style={{ fontWeight: 'bold' }}>Description</p>
                            <p className="description mb-4" style={{ fontSize: '1.2rem', color: 'grey' }}>{description}</p>
                            <div className="buttons d-flex align-items-center">
                            {/* Add a wrapper div around the FontAwesomeIcon for better control over styling */}
                            <div style={{ marginRight: '1rem' }}> {/* Adds right margin to the heart icon */}
                                <FontAwesomeIcon icon={faHeart}  style={{ color: "salmon" ,fontSize: "24px" }} onClick={handleWishlistClick} />
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
            {/* Section pour les produits similaires */}
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

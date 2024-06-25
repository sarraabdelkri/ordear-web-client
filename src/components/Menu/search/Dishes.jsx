import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dish from '../search/Dish'; // Import the Dish component
import SubHeading from "../../Menu/SubHeading";
import { useParams } from 'react-router-dom';
import backgroundImage from '../../../assets/full-bg.png';
import './Dishes.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { toast } from 'react-hot-toast'; // Ensure you use react-hot-toast
import { useSelector } from 'react-redux'; // Import useSelector for Redux state

function Dishes({ dishes }) {
  const { restaurantId } = useParams();
  const [categories, setCategories] = useState([]);
  const [menuName, setMenuName] = useState('');
  const [menuId, setMenuId] = useState('');
  const [productList, setProductList] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [restaurantData, setRestaurantData] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const cartData = useSelector((state) => state.cart); 
  // Access Redux state

  // Store restaurant ID in local storage when the component is mounted
  useEffect(() => {
    if (restaurantId) {
      console.log("Restaurant ID from URL:", restaurantId);
      localStorage.setItem('restaurantId', restaurantId);
    }
  }, [restaurantId]);

  console.log('Restaurant ID:', restaurantId);

  const addToCart = async (product) => {
    if (!product) {
      toast.error('Product details not available');
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
  
    console.log('Adding to cart with restaurant ID:', storedRestaurantId);
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/cart/addtocartweb/${userPass}`,
        {
          productFK: product._id,
          quantity: 1,
          restaurantFK: storedRestaurantId,
        },
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        toast.success("Product added to cart!");
        const updatedCartItems = [...cartItems];
        const existingItemIndex = updatedCartItems.findIndex(item => item._id === product._id);
        if (existingItemIndex !== -1) {
          updatedCartItems[existingItemIndex].quantity += 1;
        } else {
          updatedCartItems.push({ ...product, quantity: 1 });
        }
        setCartItems(updatedCartItems);
  
        const cartId = response.data.cartId;
        localStorage.setItem('cartTrash', cartId); // Stocker l'ID du cartTrash dans localStorage
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error(error.message || "An error occurred while adding product to cart");
    }
  };
  

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/menu/retrieve/by/resto/${restaurantId}`);
        const menuData = response.data;
        if (menuData && menuData.length > 0) {
          const menu = menuData[0]; // Access the first menu in the array
          setMenuName(menu.name);
          setMenuId(menu._id); // Get the menu ID
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };
    fetchMenuData();
  }, [restaurantId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!menuId) {
          console.error('Menu ID is missing');
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/category/find/item/by/menus/${menuId}`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [menuId]);

  useEffect(() => {
    const fetchProductListByMenu = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/product/retrieveallbymenu/${menuId}`);
        setProductList(response.data.data);
      } catch (error) {
        console.error('Error fetching product list by menu:', error);
      }
    };
    if (menuId) {
      fetchProductListByMenu();
    }
  }, [menuId]);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/product/retrieveallbymenu/${menuId}`);
      setProductList(response.data.data);
    } catch (error) {
      console.error('Error fetching all products:', error);
    }
  };

  const chunkProductList = (arr, size) => {
    return arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);
  };

  const handleCategoryClick = async (categoryFK) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/product/retrieve/enabled/products/category/${categoryFK}`);
      const products = response.data;
      console.log('Products associated with the category:', products);
      setProductList(products);
    } catch (error) {
      console.error('Error fetching products by category:', error);
    }
  };

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

  const handlePriceFilter = (range) => {
    setPriceRange(range);
    const filteredProducts = productList.filter(product => product.price >= range[0] && product.price <= range[1]);
    setProductList(filteredProducts);
  };

  const totalPages = Math.ceil(productList.length / itemsPerPage);
  const currentPageData = productList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section className="py-3 py-md-5 py-xl-8">
      {restaurantData && (
        <div className="home-container" style={{ backgroundImage: "white", marginTop: 0 }}>
          <div className="app__specialMenu flex__center section__padding" id="menu">
            <div className="app__specialMenu-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: "50px" }}>
              <SubHeading title="Menu that fits your palette" />
              <h1 className="headtext__cormorant">Today's Special in {menuName}</h1>
            </div>
          </div>
          <div className="categories" style={{ display: 'flex', justifyContent: 'center', marginTop: "30px", marginBottom: "30px", flexWrap: 'wrap' }}>
            <button style={{ margin: '10px', borderRadius: "10px", backgroundColor: restaurantData.color, color: "#333", padding: "10px 20px" }} onClick={fetchAllProducts}>
              All
            </button>
            {categories.map((category, index) => (
              <button key={index} style={{ margin: '10px', borderRadius: "10px", backgroundColor: restaurantData.color, color: "#333", padding: "10px 20px" }} onClick={() => handleCategoryClick(category._id)}>
                {category.libelle}
              </button>
            ))}
            <div style={{ margin: '10px', padding: "10px 20px", backgroundColor: "#fff", color: "#333" }}>
              <Slider
                range
                min={0}
                max={100} // Change this value according to your highest price
                defaultValue={[0, 100]} // Change this value according to your default price range
                onChange={handlePriceFilter}
                value={priceRange}
                trackStyle={[{ backgroundColor: restaurantData.color }]}
                handleStyle={[{ borderColor:restaurantData.color }]}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ width: '50px', textAlign: 'center' }}>${priceRange[0]}</span>
                <span style={{ width: '50px', textAlign: 'center' }}>${priceRange[1]}</span>
              </div>
            </div>
          </div>
          <div className="dish-container">
            {chunkProductList(currentPageData, 3).map((chunk, index) => (
              <div key={index} className="dish-row" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {chunk.map(product => (
                  <div key={product._id} className="dish-item" style={{ flex: '1 1 30%', margin: '10px' }}>
                    <Dish product={product} addToCart={() => addToCart(product)} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            {[...Array(totalPages)].map((_, index) => (
              <button key={index} style={{ margin: '0 5px', padding: '5px 10px', borderRadius: '5px', backgroundColor: restaurantData.color }} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Dishes;

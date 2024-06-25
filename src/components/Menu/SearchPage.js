import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../Home/AboutUs.module.css";
import "./item.css";
import { toast } from 'react-toastify';
import "./search.module.css";
import About from '../Menu/search/About';
import Dishes from "./search/Dishes";
import Home from "./search/Home";
import Testimonials from "./search/Testimonial";
import ReclamationForm from "./search/ReclamationForm";
import Footer from "../Footer/Footer";
import ChatButton from '../Menu/search/ChatButton'; // Importez le nouveau composant

const SearchPage = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [test, setTest] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const cardRef = useRef(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showExtraBoxes, setShowExtraBoxes] = useState(false);

  const handleClick = () => {
    setShowExtraBoxes(true); // Afficher les boîtes supplémentaires lors du clic sur une image
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/restaurant/retrieve/${restaurantId}`);
        setRestaurant(response.data);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    };
    fetchRestaurant();
  }, [restaurantId]);

  const scrollToCard = () => {
    if (cardRef.current) {
      // Get the y-coordinate of the top of the card relative to the window
      const yOffset = cardRef.current.getBoundingClientRect().top;

      // Scroll to the top of the card with smooth behavior
      window.scrollTo({ top: window.scrollY + yOffset, behavior: "smooth" });
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/menu/retrieve/by/resto/${restaurantId}`,
        {
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error("Le menu n'existe pas");
      } else {
        // Ajoutez les catégories associées à chaque élément de menu
        const menuWithCategories = responseData.map((menuItem) => ({
          ...menuItem,
          categories: fetchCategoriesForMenuItem(menuItem._id),
        }));
        setMenu(menuWithCategories);
      }
    } catch (err) {
      toast.error(err.message, {
        style: {
          border: "1px solid #FA8072",
          padding: "16px",
          color: "#FA8072",
        },
        iconTheme: {
          primary: "#FA8072",
          secondary: "#f88f8f",
        },
      });
    }
  };

  const fetchProducts = async (cat) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/product/retrieve/enabled/products/category/${cat}`,
        {
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        setProducts(responseData);
      }
    } catch (err) {
      toast.error(err.message, {
        style: {
          border: "1px solid #FA8072",
          padding: "16px",
          color: "#FA8072",
        },
        iconTheme: {
          primary: "#FA8072",
          secondary: "#f88f8f",
        },
      });
    }
  };

  const fetchItems = async (cat) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/item/retrieveall`,
        {
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        setItems(responseData);
      }
    } catch (err) {
      toast.error(err.message, {
        style: {
          border: "1px solid #FA8072",
          padding: "16px",
          color: "#FA8072",
        },
        iconTheme: {
          primary: "#FA8072",
          secondary: "#f88f8f",
        },
      });
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchCategories();
    fetchIngredients();
    fetchItems();
    setTimeout(() => {
      setTest(true);
    }, 1000);
  }, [test, clicked]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/category/find/item/by/menu/${menu._id}`,
        {
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        setCategories(responseData);
      }
    } catch (err) {
      toast.error(err.message, {
        style: {
          border: "1px solid #FA8072",
          padding: "16px",
          color: "#FA8072",
        },
        iconTheme: {
          primary: "#FA8072",
          secondary: "#f88f8f",
        },
      });
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/ingredient/retrieveall`,
        {
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        setIngredients(responseData);
      }
    } catch (err) {
      toast.error(err.message, {
        style: {
          border: "1px solid #FA8072",
          padding: "16px",
          color: "#FA8072",
        },
        iconTheme: {
          primary: "#FA8072",
          secondary: "#f88f8f",
        },
      });
    }
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/menu/retrieve/by/resto/${restaurantId}`, {
          credentials: 'include',
        });
        const responseData = response.data;
        const menuWithCategories = await Promise.all(responseData.map(async (menuItem) => {
          const categories = await fetchCategoriesForMenuItem(menuItem._id);
          return { ...menuItem, categories };
        }));
        setMenu(menuWithCategories);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };
    fetchMenu();
  }, [restaurantId]);

  const fetchCategoriesForMenuItem = async (menuItemId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/category/find/item/by/menu/${menuItemId}`, {
        credentials: 'include',
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  const handleCategoryClick = (categoryId) => {
    // Logic to handle category click
  };

  const [selectedMenu, setSelectedMenu] = useState(null);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setShowDetails(true);
  };

  return (
    <>
      <About />
      <Home />
      <Dishes />
      <Testimonials />
      
      <Footer />
      <ChatButton /> {/* Ajoutez le bouton de chat ici */}
    </>
  );
};

export default SearchPage;

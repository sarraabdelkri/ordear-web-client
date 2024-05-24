
import React, { useState, useEffect ,useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import logo from "../../assets/logo12.png";
import bground from "../../assets/bg-title-page-01.jpg";
import { NavLink } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram , faTwitter, faLinkedin, faPinterestP, faYoutube } from "@fortawesome/free-brands-svg-icons";
import bg from "../../assets/welcome.png";

import SubHeading from "../Menu/SubHeading";
import Navs from "../Navs/Navs";
import  "../Home/AboutUs.module.css";
import abtbg from "../../assets/bg-title-page-01.jpg";
import image1 from "../../assets/blog-14.jpg";
import image2 from "../../assets/dinner-04.jpg";
import "./item.css";
import { BsEyeFill, BsFillCartPlusFill } from "react-icons/bs";
import { animateScroll as scroll } from "react-scroll";
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import {AiFillCalendar} from "react-icons/ai";
import {FaGulp} from "react-icons/fa";
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Grid, Divider } from '@mui/material';
import logo2 from "../../assets/ab.png";
import backgroundImage from "../../assets/full-bg.png";
import { toast } from 'react-toastify';
import "./search.module.css";
import panckes from "../../assets/cocktail.jpg";
import coctail from "../../assets/restaurant-gallery.jpg";
import r1 from "../../assets/coctail.jpg";
import images from "../../images/r3.jpg";
import logo545 from "../../assets/logo545.png";

import About from '../Menu/search/About'
import Menu from '../Menu/search/Menu'

import Order from '../Menu/search/Order'
import Header from "../Menu/search/Header";
import Dish from "./search/Dish";
import Dishes from "./search/Dishes";
import Navbar from "./search/Navbar";
import Home from "./search/Home";
import Testimonials from "./search/Testimonial";
import Footer from "../Footer/FooterRest";





const SearchPage = () => {
  const { restaurantId } = useParams();
  
  const [restaurant, setRestaurant] = useState(null);
  const [mobileView, setMobileView] = useState(false);
  const [test, setTest] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [items, setItems] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState(null);
  const [products, setProducts] = useState([]);
  const [result, setResult] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    minHeight: "90%",
    width: "90%",
    overflow: "scroll",
  };
 


  

  


  const [selectedMenu, setSelectedMenu] = useState(null);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setShowDetails(true);
  };
  return (
    <>

      <About />
      <Home/>
      <Dishes />
      <Testimonials/>
      <Footer/>

    </>
  );
                    }              

export default SearchPage;
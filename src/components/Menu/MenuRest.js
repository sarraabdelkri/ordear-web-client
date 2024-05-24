import React, { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import Navs from "../Navs/Navs";
import Footer from "../Footer/Footer";
import "./item.css";
import { BsEyeFill, BsFillCartPlusFill } from "react-icons/bs";
import { Toaster, toast } from "react-hot-toast";
import { animateScroll as scroll } from "react-scroll";
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import {AiFillCalendar} from "react-icons/ai";
import {FaGulp} from "react-icons/fa";
import styles from "../Home/Header.module.css";
import { Divider } from '@mui/material';
import axios from "axios";
import bg from "../../assets/welcome.png";
import backgroundImage from "../../assets/full-bg.png";
import SubHeading from "../Menu/SubHeading";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Box,
  Grid,
  Paper,
  Slide,
  Typography,
  Modal,
  FormControlLabel,
  TextField,
  Checkbox,
  
} from "@mui/material";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { current } from "@reduxjs/toolkit";
import About from '../Menu/search/About'
import Dishes from "./search/Dishes";
import Home from "./search/Home";
import Testimonials from "./search/Testimonial";

function MenuRest() {
  const { restaurantId } = useParams(); // Get the restaurant ID from the URL
  const [clicked, setClicked] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [currentProduct, setCurrentProduct] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState([]);
  const [currentItem, setCurrentItem] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);

  const [showSubMenu, setShowSubMenu] = useState(false);

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

  const setItemsToIngredient = (ingredients, items) => {
    const finalIngredients = ingredients.map((ingredient) => {
      const itemsToReturn = items.filter((item) => {
        if (item.ingredientFK !== null) {
          if (item.ingredientFK?._id === ingredient._id) {
            return item;
          }
        }
      });
      return { ...ingredient, items: itemsToReturn };
    });
    return finalIngredients;
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/restaurant/retrieve/${restaurantId}`)
      .then(response => {
        setRestaurantData(response.data);
      })
      .catch(error => {
        console.error('Error fetching restaurant data:', error);
      });
  }, [restaurantId]);

  const setIngredientsToProduct = (products, ingredients, items, productId) => {
    const _ingredients = setItemsToIngredient(ingredients, items);
    const _products = products.map((product) => {
      const ingredientsToReturn = _ingredients.filter((ingredient) => {
        if (ingredient.productFK !== null) {
          if (ingredient.productFK === product._id) {
            return ingredient;
          }
        }
      });
      return { ...product, ingredients: ingredientsToReturn };
    });
    const _currentProduct = _products.find(
      (_product) => _product._id === productId
    );
    return _currentProduct;
  };

  const handleOpen = (product) => {
    const _currentProduct = setIngredientsToProduct(
      products,
      ingredients,
      items,
      product._id
    );

    setCurrentProduct(_currentProduct);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const [test, setTest] = useState(false);
  const [result, setResult] = useState({
    restaurantId,
    tableNb: "1",
  });
  const [menu, setMenu] = useState({});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [items, setItems] = useState([]);

  const [showProduct, setShowProduct] = useState(false);

  const cardRef = useRef(null);

  const scrollToCard = () => {
    if (cardRef.current) {
      const yOffset = cardRef.current.getBoundingClientRect().top;
      window.scrollTo({ top: window.scrollY + yOffset, behavior: "smooth" });
    }
  };

  const fetchIngredientsForItem = async (itemId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/ingredient/getVisibleItemByIngredientId/${itemId}`,
        {
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        setCurrentIngredient(responseData);
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

  const fetchMenu = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/menu/retrieve/by/resto/${result.restaurantId}`,
        {
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error("Le menu n'existe pas");
      } else {
        setMenu(responseData[0]);
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

  const fetchItems = async () => {
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

  const string = `Bienvenue chez  ${menu.name} ...`;

  let index = useRef(0);
  const [placeholder, setPlaceholder] = useState(string[0]);

  useEffect(() => {
    function tick() {
      index.current++;
      setPlaceholder((prev) => prev + string[index.current]);
    }
    if (index.current < string.length - 1) {
      let addChar = setInterval(tick, 100);
      return () => clearInterval(addChar);
    }
  }, [placeholder]);

  return (
    <div>
      <About />
      <Home />
      <Dishes />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default MenuRest;

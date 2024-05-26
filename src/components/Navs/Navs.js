import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Navs.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineLock, AiOutlineQrcode, AiOutlineStar, AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { authActions } from "../../store/authSlice";
import menu from "../../assets/bars-solid.svg";
import { Toaster, toast } from "react-hot-toast";
import "./burger.css";
import VerticalMenu from "./VerticalMenu";
import { ListGroup } from 'react-bootstrap';
import { useMediaQuery } from "@react-hook/media-query";
import logo from "./../../assets/menu.com.png";
import { Dropdown, Collapse, initMDB } from "mdb-ui-kit";
import { faSearch, faShoppingCart, faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import fr from "./../../assets/fr.svg"
import gb from "./../../assets/gb.svg"
import pt from "./../../assets/pt.svg"
import tn from "./../../assets/tn.svg"
import { faUser, faUserCircle, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";  
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { cartActions } from '../../store/cartSlice';
import { BsCart2 } from "react-icons/bs";

const Navs = () => {
  initMDB({ Dropdown, Collapse });
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const isGoogleAuth = useSelector((state) => state.auth.isGoogleAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userEmail);
  const token = localStorage.getItem('token');
  const cartItems = useSelector(state => state.cart.cartData || []);
  const [anchorEl, setAnchorEl] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileView, setMobileView] = useState(false);
  const matches = useMediaQuery("(max-width: 800px)");
  const [fix, setFix] = useState(false);
  const [result, setResult] = useState({ text: 'No result' });
  const [redirect, setRedirect] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userFullName, setUserFullName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);

  const toggleMobileView = () => {
    setMobileView(!mobileView);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setRedirect(true);
      fetchRestaurants();
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/menu/search?term=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }
      const data = await response.json();
      console.log("Données des restaurants récupérées :", data);
      setRestaurants(data);
      if (redirect) {
        navigate("/search-results");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [redirect, searchTerm]);

  useEffect(() => {
    const setFixed = () => {
      if (window.scrollY > 0) {
        setFix(true);
      } else {
        setFix(false);
      }
    };

    const onScroll = () => {
      setFixed();
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/getUser`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        const userData = await response.json();
        console.log("UserData:", userData); // Ajout d'un log pour voir les données de l'utilisateur
        if (response.ok && userData.length > 0) {
          setUserFullName(`${userData[0].firstName} ${userData[0].lastName}`);
          fetchUserImage();
        } else {
          throw new Error("Invalid user data");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    if (isAuth || isGoogleAuth) {
      fetchUserData();
    }
  }, [isAuth, isGoogleAuth, token]);

  const fetchUserImage = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/getImage`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user image");
      }
      const imageBlob = await response.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setUserImage(imageObjectURL);
    } catch (error) {
      console.error('Error fetching user image:', error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        toast.success("Vous êtes déconnecté", {
          style: {
            border: "1px solid #FA8072",
            padding: "16px",
            color: "#FA8072",
          },
          iconTheme: {
            primary: "#FA8072",
            secondary: "#FFA0A0",
          },
        });
        dispatch(authActions.logout());
        navigate("/home");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      toast.error("Erreur lors de la déconnexion", {
        style: {
          border: "1px solid #FA8072",
          padding: "16px",
          color: "#FA8072",
        },
        iconTheme: {
          primary: "#FA8072",
          secondary: "#FFA0A0",
        },
      });
    }
  };

  const navigateToProfile = () => {
    navigate("/home");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRestaurants();
  };

  useEffect(() => {
    // Initialiser le dropdown après le rendu du composant
    const dropdownElement = document.getElementById('navbarDropdownMenuAvatar');
    if (dropdownElement) {
      dropdownElement.addEventListener('click', function () {
        dropdownElement.classList.toggle('show');
      });
    }
  }, []);

  useEffect(() => {
    // Fetch the logo image when the component mounts
    async function fetchLogo() {
      try {
        const response = await fetch("http://localhost:5555/logos/saumon");
        if (!response.ok) {
          throw new Error("Failed to fetch logo");
        }
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setLogoUrl(imageUrl);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    }

    fetchLogo();
  }, []); 

  const fetchCart = async() => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cart/get/cartTrashweb/by/user`,{
        credentials : "include"
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error("cart doesn't exist");
      } else {
        dispatch(cartActions.setCart(responseData));
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const total = useSelector(state => state.cart.total);
  const handleCartClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCartClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="container-fluid position-relative p-0">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            

            {/* Logo */}
            <div className={styles.logo}>
            
              <a href="/">
              <img
          className={styles.logo}
          src={logoUrl} 
          alt="Logo"
         
        />
              </a>
            </div>
            <div className={"collapse navbar-collapse" + (mobileView ? " show" : "") + (mobileView ? " navbar-collapse-right" : "")} id="navbarCollapse" style={{justifyContent:"flex-end"}}>

              <div className="navbar-nav mx-auto">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                  <NavLink to="" className="nav-link" activeClassName="active" aria-current="page">
                      Flavors
                    </NavLink>
                    
                  </li>
                  <li className="nav-item">
                    <NavLink to="#" className="nav-link" >
                      About Us
                    </NavLink>
                  </li>
                  <li className="nav-item">
                  <NavLink to="#" className="nav-link" >
                      Our Partners
                    </NavLink>
                  </li>
                  <li className="nav-item">
                  <NavLink to="#" className="nav-link" >
                      whychooseUs
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bouton de basculement du menu mobile à droite */}
           

            {/* Dropdown */}
            <div className="ms-auto d-flex align-items-center">
              {isAuth || isGoogleAuth ? (
                <div className="d-flex align-items-center">
                  <a className="link-salmon me-3" href="/cart"  >
                  <AiOutlineShoppingCart  onClick={handleCartClick} style={{ fontSize: "25px" ,width: "25px" }} />
                  <span>{total}</span>
                  </a>
                  <div className="dropdown">
                  <a
                    data-mdb-dropdown-init
                    className="dropdown-toggle d-flex align-items-center hidden-arrow me-3 link-salmon"
                    href="/home"
                    id="navbarDropdownMenuAvatar"
                    role="button"
                    aria-expanded="false"
                  >                
                    {userImage ? (
                      <img
                        src={userImage}
                        className="rounded-circle"
                        style={{ height: "50px" }}
                        alt="User"
                        loading="lazy"
                      />
                    ) : (
                      <AiOutlineUser className="rounded-circle" style={{ height: "40px" }} />
                    )}
                  </a>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      style={{
                        height: "auto",
                        backgroundColor: "black",
                        padding: "0.25rem 0", 
                        marginTop: "50px",
                      }}
                      aria-labelledby="navbarDropdownMenuAvatar"
                    >
                      <li>
                        <div className="dropdown-item" style={{ fontSize: "15px", textDecoration: "none" ,color: "white"}}>
                        <AiOutlineUser className="me-2"  /> {/* Icône utilisateur avec une taille de police de 20px */}

                          <span>{userFullName}</span>
                        </div>
                      </li>
                      <li>
                        <NavLink className="dropdown-item" style={{ fontSize: "12px", color: "white" }} to="/profile">
                          <AiOutlineUser className="me-2" /> {/* Icône profil */}
                          My profile
                        </NavLink>
                      </li>
                      <li>
                        <a className="dropdown-item" style={{ fontSize: "12px", color: "white" }}>
                          <AiOutlineUser className="me-2" /> {/* Icône paramètres */}
                          Settings
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" style={{ fontSize: "12px", color: "white" }} onClick={logout}>
                          <AiOutlineUser className="me-2" /> {/* Icône déconnexion */}
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="dropdown">
                    <a
                      data-mdb-dropdown-init
                      className="dropdown-toggle d-flex align-items-center hidden-arrow me-3 link-salmon"
                      href="/"
                      id="navbarDropdown"
                      role="button"
                      aria-expanded="false"
                    >
                      <img src={gb} className="flag-icon" style={{ width: "15px", height: "auto" }} />
                    </a>
                    <ul className="dropdown-menu" style={{ height: "auto", backgroundColor: "black", padding: "0.25rem 0", marginTop: "30px", width: "50px" }} aria-labelledby="navbarDropdown">
                      <li>
                        <a className="dropdown-item" style={{ padding: "0.25rem 0.5rem", fontSize: "12px", color: "white" }}>
                          <img src={gb} alt="Flag" className="flag-icon" style={{ width: "20px", height: "auto" }} />
                          English
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" style={{ padding: "0.25rem 0.5rem", fontSize: "12px", color: "white" }}>
                          <img src={fr} alt="Flag" className="flag-icon" style={{ width: "20px", height: "auto" }} />
                          Français
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" style={{ padding: "0.25rem 0.5rem", fontSize: "12px", color: "white" }}>
                          <img src={tn} alt="Flag" className="flag-icon" style={{ width: "20px", height: "auto" }} />
                          Arabe
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" style={{ padding: "0.25rem 0.5rem", fontSize: "12px", color: "white" }}>
                          <img src={pt} alt="Flag" className="flag-icon" style={{ width: "20px", height: "auto" }} />
                          Português
                        </a>
                      </li>
                    </ul>
                  </div>
                  <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarCollapse"
                  aria-controls="navbarCollapse"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                  onClick={toggleMobileView}
                >
                  <span className="navbar-toggler-icon"></span>
                </button>

                </div>
                
                
              ) : (
                <NavLink to="/login" className={styles.lastnavlink}>
                  <button className={"button-30 "}>
                    <AiOutlineUser className="mx-1" /> Connexion
                  </button>
                </NavLink>
              )}
            </div>
          </div>
          
        </nav>
      </div>
    </>
  );
};

export default Navs;

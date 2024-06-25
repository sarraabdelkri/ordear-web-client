import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Toaster, toast } from "react-hot-toast";
import { useMediaQuery } from "@react-hook/media-query";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { cartActions } from '../../store/cartSlice';
import OriginalLogo from "../../assets/logo11.png";
import { faHeart, faBell } from '@fortawesome/free-solid-svg-icons';
import fr from "./../../assets/fr.svg";
import gb from "./../../assets/gb.svg";
import pt from "./../../assets/pt.svg";
import tn from "./../../assets/tn.svg";
import { authActions } from "../../store/authSlice";
import styles from "./Navs.module.css";
import { Dropdown, Collapse, initMDB } from "mdb-ui-kit";

const Navs = () => {
  const isMobile = useMediaQuery({ maxWidth: 500, maxHeight: 900 });
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
  const [cartTrash, setCartTrash] = useState(null);

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
    if (isMobile) {
      setOpenCart(false);
      setShowSettings(false);
    }
  };

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
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }
        const url = `${process.env.REACT_APP_BACKEND_URL}/user/getById/${userId}`;
        const response = await fetch(url, {
          credentials: "include",
        });
        const userData = await response.json();
        console.log("UserData:", userData); 
        if (response.ok && userData) {
          setUserFullName(`${userData.firstName} ${userData.lastName}`);
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
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }
      const url = `${process.env.REACT_APP_BACKEND_URL}/user/getImageByUserId/${userId}`;
      const response = await fetch(url, {
        credentials: "include",
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
    const dropdownElement = document.getElementById('navbarDropdownMenuAvatar');
    if (dropdownElement) {
      dropdownElement.addEventListener('click', function () {
        dropdownElement.classList.toggle('show');
      });
    }
  }, []);

  useEffect(() => {
    async function fetchLogo() {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/logos/saumon`);
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

  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User not found in localStorage");
      }
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/cart/get/cartTrashweb/by/user/${userId}`,
        {
          credentials: "include",
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      if (!response.ok) {
        throw new Error("cart doesn't exist");
      } else {
        dispatch(cartActions.setCart(responseData));
        setCartTrash(responseData?.cartData[0]?._id);
      }
    } catch (err) {
      toast.error(err.message, {
        style: {
          border: "1px solid #81007F",
          padding: "16px",
          color: "#81007F",
        },
        iconTheme: {
          primary: "#81007F",
          secondary: "#D6C7D4",
        },
      });
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
    <div className={styles.navbarContainer}>
      <nav className={`${styles.navbar} ${fix ? styles.fixed : ''}`}>
        <div className={styles.logoContainer}>
          <a href="/">
            <img src={OriginalLogo} alt="Logo" className={styles.logo} />
          </a>
          <button className={styles.menuToggle} onClick={toggleMenu}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </button>
        </div>
        <ul className={`${styles.navLinks} ${openMenu && isMobile ? styles.navActive : ''}`}>
          <li><NavLink to="/home" activeClassName={styles.active}>HOME</NavLink></li>
          <li><NavLink to="/about" activeClassName={styles.active}>ABOUT</NavLink></li>
          <li><NavLink to="/blog" activeClassName={styles.active}>BLOG</NavLink></li>
          <li><NavLink to="/reclamationlist" activeClassName={styles.active}>CLAIMS</NavLink></li>
        </ul>
        <div className={`${styles.navActions} ${openMenu && isMobile ? styles.navActive : ''}`}>
          <NavLink to="/cart" className={styles.navLink}>
            <AiOutlineShoppingCart className={styles.icon} />
          </NavLink>
          {isAuth && (
            <>
              <NavLink to="/wishlist" className={styles.navLink}>
                <FontAwesomeIcon icon={faHeart} className={styles.icon} style={{ color: 'red' }} />
              </NavLink>
              <NavLink to="/notifications" className={`${styles.navLink} ${styles.notificationIcon}`}>
                <FontAwesomeIcon icon={faBell} className={styles.icon} style={{ color: 'yellow' }} />
                <span className={styles.notificationCount}>5</span>
              </NavLink>
              <div className="dropdown">
                <a
                  data-mdb-dropdown-init
                  className="dropdown-toggle d-flex align-items-center hidden-arrow me-3 link-salmon"
                  href="/home"
                  id="navbarDropdownMenuAvatar"
                  role="button"
                  aria-expanded="false"
                  style={{ color: "salmon" }}
                >
                  {userImage ? (
                    <img
                      src={userImage}
                      className="rounded-circle"
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                      }}
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
                    <div className="dropdown-item" style={{ fontSize: "15px", textDecoration: "none", color: "white" }}>
                      <AiOutlineUser className="me-2" />
                      <span>{userFullName}</span>
                    </div>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" style={{ fontSize: "12px", color: "white" }} to="/profile">
                      <AiOutlineUser className="me-2" />
                      My profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" style={{ fontSize: "12px", color: "white" }} to="/reclamationlist">
                      <AiOutlineUser className="me-2" />
                      Claims
                    </NavLink>
                  </li>
                  <li>
                    <a className="dropdown-item" style={{ fontSize: "12px", color: "white" }} onClick={logout}>
                      <AiOutlineUser className="me-2" />
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </>
          )}
          {!isAuth && (
            <NavLink to="/login" className={styles.navLink}>
              <AiOutlineUser className={styles.icon} />
              Login
            </NavLink>
          )}
          <div className="dropdown">
            <a
              data-mdb-dropdown-init
              className="dropdown-toggle d-flex align-items-center hidden-arrow me-3 link-salmon"
              href="/"
              id="navbarDropdown"
              role="button"
              aria-expanded="false"
              style={{ color: "salmon" }}
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
      </nav>
    </div>
  );
  
};

export default Navs;
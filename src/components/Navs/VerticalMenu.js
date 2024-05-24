import React, { useState } from "react";
import "./burger.css";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import styles from "./Navs.module.css";
import { Toaster, toast } from "react-hot-toast";
import { authActions } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import PlayStore from "../../assets/googlePlay.png";
import AppleStore from "../../assets/applestore.png";
function VerticalMenu() {
  const [menuActive, setMenuActive] = useState(false);
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
        toast.success("Déconnexion", {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
        });
        dispatch(authActions.logout());

        navigate("/home");
      }
    } catch (err) {
      console.log(err);
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

  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const closeMenu = () => {
    setMenuActive(false);
  };

  return (
    <div style={{ marginTop: 15, marginRight: 30 }}>
      <header>
        <div
          className={`menu-btn ${menuActive ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </header>

      <div className="header__nav">
        <nav className={`nav_ ${menuActive ? "active" : ""}`}>
          <ul className="nav__list mt-5">
            <li
              style={{ marginTop: 50, position: "fixed", marginRight: 30 }}
              className="row"
            >
              <div className="col-12 d-flex justify-content-center">
                <img
                  style={{
                    border: "1px solid white",
                    borderRadius: 7,
                    cursor: "pointer",
                  }}
                  width={"80%"}
                  height={50}
                  src={PlayStore}
                  alt=""
                />
              </div>
              <div className="mt-3"></div>
              <div className="col-12 d-flex justify-content-center">
                <img
                  style={{
                    cursor: "pointer",
                    borderRadius: 10,
                    border: "1px solid white",
                  }}
                  width={"80%"}
                  height={50}
                  src={AppleStore}
                  alt=""
                />
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default VerticalMenu;

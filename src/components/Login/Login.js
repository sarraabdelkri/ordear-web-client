import { Fragment } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import brand3 from "../../assets/brand3.png";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/authSlice";
import email from "../../assets/envelope-solid.svg";
import pass from "../../assets/lock-solid.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  const login = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/loginweb`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        dispatch(authActions.login(credentials.email));
        localStorage.setItem("tokenLogin", responseData.tokenLogin);
        const toast1 = toast.success("successful login", {
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
        setTimeout(() => {
          navigate("/menu");
          toast.remove(toast1);
        }, 1000);
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

  return (
    <Fragment>
      {isAuth ? (
        <center style={{ marginTop: "30px" }}>
          <h2>you're already logged in !</h2>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            style={{ color: "#ec27dc", width: "50px", height: "50px" }}
          />
        </center>
      ) : (
        <>
          <div>
            <Toaster />
          </div>

          <section className="pride mt-4">
            <div className="container shadow ">
              <div className="row">
                <div className="col-md-6 d-flex flex-column align-items-center text-white justify-content-center form">
                  {/* <img
                    src={brand3}
                    alt="sign in Image"
                    className={styles.signInImage}
                  /> */}
                </div>
                <div className="col-md-6 p-5">
                  <h1 className="display-6 fw-bolder mb-5">Sign in</h1>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      login();
                    }}
                  >
                    <div className="mb-3">
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Email:
                        </label>
                        <div className="inputContainer">
                          <img src={email} alt="icon" className="icon" />
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={(e) =>
                              setCredentials((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          Password:
                        </label>
                        <div className="inputContainer">
                          <img src={pass} alt="icon" className="icon" />
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={(e) =>
                              setCredentials((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="col-md-6 p-1 ps-md-4">
                        <NavLink to="/forget">Forget password ?</NavLink>
                      </div>
                    </div>
                    <center className={styles.buttons}>
                      <button type="submit" name="submit">
                        Sign in
                      </button>

                      <NavLink to="/signup" className={() => styles.navlink}>
                        Sign up
                      </NavLink>
                    </center>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </Fragment>
  );
};

export default Login;

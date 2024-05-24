import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import signup from "../../assets/brandComputer1.png";
import { Toaster, toast } from "react-hot-toast";
import user from "../../assets/user-solid.svg";
import email from "../../assets/envelope-solid.svg";
import pass from "../../assets/lock-solid.svg";
import check from "../../assets/check-solid.svg";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const initialCredentials = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordVerify: "",
};

const Signup = () => {
  const [credentials, setCredentials] = useState(initialCredentials);
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const [passwordError, setPasswordError] = useState('');
  const [passwordVerifyError, setPasswordVerifyError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));

    
    const passwordRegex = /^(?=.*[a-z].*[a-z])(?=.*[A-Z])(?=.*[@#])(?=.{6,})/;
    if (name === 'password') {
      if (!passwordRegex.test(value)) {
        setPasswordError('Mot de passe invalide: au moins 6 caractères, 1 majuscule, 2 minuscules et 1 caractère spécial (@ ou #)');
      } else {
        setPasswordError('');
      }
    }

    
    if (name === 'passwordVerify') {
      if (value !== credentials.password) {
        setPasswordVerifyError('Les mots de passe ne correspondent pas');
      } else {
        setPasswordVerifyError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    
      if (
        !credentials.firstName ||
        !credentials.lastName ||
        !credentials.email ||
        !credentials.password ||
        !credentials.passwordVerify
      ) {
        throw new Error("Tous les champs doivent être saisis");
      }
    
      if (credentials.password !== credentials.passwordVerify) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/registerClient`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(credentials),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        const toast1 = toast.success(responseData.message, {
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
          toast.remove(toast1);
          navigate("/activate");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
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
    <>
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

          <section className={`${styles.signup} pride mt-4`}>
            <div className="container shadow">
              <div className="row">
                <div className="col-md-6 d-flex flex-column align-items-center text-white justify-content-center form">
                  <div className="background-image-container">
                    <div className="background-image-wrapper">
                      <img
                        className="background-image"
                        src={signup}
                        alt="sign Image"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 p-5">
                  <h1 className="display-6 fw-bolder mb-5">Sign up</h1>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <div className="mb-3">
                        <label htmlFor="firstname" className="form-label">
                          FirstName:
                        </label>
                        <div className="inputContainer">
                          <img src={user} alt="icon" className="icon" />
                          <input
                            type="text"
                            className="form-control"
                            id="firstname"
                            name="firstName"
                            placeholder="firstname*"
                            value={credentials.firstName}
                            onChange={handleChange}
                            required 
                          />
                          {!credentials.firstName && (
                            <p style={{ color: "red", fontStyle: "italic" }}>
                              FirstName requis
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="lastname" className="form-label">
                        LastName:
                      </label>
                      <div className="inputContainer">
                        <img src={user} alt="icon" className="icon" />
                        <input
                          type="text"
                          className="form-control"
                          id="lastname"
                          name="lastName"
                          placeholder="lastname*"
                          value={credentials.lastName}
                          onChange={handleChange}
                          required // Champ requis
                        />
                        {!credentials.lastName && (
                          <p style={{ color: "red", fontStyle: "italic" }}>
                            LastName requis
                          </p>
                        )}
                      </div>
                    </div>

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
                          placeholder="Email*"
                          value={credentials.email}
                          onChange={handleChange}
                          required // Champ requis
                        />
                        {!credentials.email && (
                          <p style={{ color: "red", fontStyle: "italic" }}>
                            Email requis
                          </p>
                        )}
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
                          placeholder="Password*"
                          value={credentials.password}
                          onChange={handleChange}
                          required // Champ requis
                        />
                        {passwordError && <p style={{ color: "red", fontStyle: "italic" }}>{passwordError}</p>}
                      </div>
                      </div>
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                      </label>
                      <div className="inputContainer">
                        <img src={check} alt="icon" className="icon" />
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            name="passwordVerify"
                            placeholder="confirmPassword*"
                            value={credentials.passwordVerify}
                            onChange={handleChange}
                            required // Champ requis
                          />
                          {passwordVerifyError && <p style={{ color: "red", fontStyle: "italic" }}>{passwordVerifyError}</p>}
                        </div>
                        </div>
                    <center className={styles.buttons}>
                      <button type="submit" name="submit">
                        Sign up
                      </button>

                      <NavLink to="/login" className={() => styles.navlink}>
                        Sign in
                      </NavLink>
                    </center>
                  </form>
                </div>
              </div>
            </div>
          </section>
          <br />
          <br />
        </>
      )}
    </>
  );
};

export default Signup;

import React, { useRef, useState, useEffect } from "react";
import "./Signin.css";
import "../../assets/spinner.css";
import Logo from "../../assets/logo5.png";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineUserAdd,
  AiOutlineUserSwitch,
} from "react-icons/ai";
import { FaGoogle } from 'react-icons/fa';
import Copyright from "../Footer/Copyright";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { authActions } from "../../store/authSlice";
import RegisterSection from "../Sign up/RegisterSection";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from 'react-google-login';

const CLIENT_ID = '647309244753-0fd17483bm3kvipl4dcv91b2k3l234ln.apps.googleusercontent.com';


function Signin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Nouvel état pour Remember Me
  const [token, setToken] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/loginWeb`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            rememberMe: credentials.rememberMe,
          }),
        }
      );
  
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        dispatch(authActions.login(credentials.email));
        localStorage.setItem("userCredentials", JSON.stringify(credentials));
        localStorage.setItem("tokenLogin", responseData.tokenLogin);
        toast.success("Vous êtes connecté", {
          style: {
            backgroundColor: "salmon",
            color: "white",
          },
          iconTheme: {
            primary: "#FA8072",
            secondary: "#f88f8f",
          },
        });
        
        setTimeout(() => {
          navigate("/home");
        }, 2500);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!credentials.email || !credentials.password) {
      toast.error("Veuillez saisir votre adresse e-mail et votre mot de passe");
      setIsSubmitting(false);
      return;
    }
    login();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setCredentials((prev) => ({ ...prev, [name]: newValue }));
    setIsSubmitting(false);
  };

  
  const loginTextRef = useRef(null);
  const loginFormRef = useRef(null);
  const loginBtnRef = useRef(null);
  const signupBtnRef = useRef(null);

  const handleSignupClick = () => {
    loginFormRef.current.style.marginLeft = "-50%";
    loginTextRef.current.style.marginLeft = "-50%";
  };

  const handleLoginClick = () => {
    loginFormRef.current.style.marginLeft = "0%";
    loginTextRef.current.style.marginLeft = "0%";
  };

  const handleSignupLinkClick = () => {
    signupBtnRef.current.click();
    return false;
  };

  const onSuccess = async (response) => {
    console.log('Connexion réussie:', response.profileObj);

    const res = await fetch('/user/googleLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: response.tokenId })
    });

    const data = await res.json();
    console.log('Réponse du serveur:', data);
  };

  const onFailure = (response) => {
    if (response.error === 'popup_closed_by_user') {
      console.warn('La fenêtre pop-up a été fermée avant la fin de l\'authentification.');
    } else {
      console.error('Échec de la connexion:', response);
    }
  };

  return (
    <React.Fragment>
      <div className="paper">
        <Toaster />
        <div className="wrapper ">
          <div className="d-flex justify-content-start align-items-start">
            <a
              title="Revenir en accueil"
              style={{ color: "#FA8072", fontSize: 24 }}
              href="/"
            >
              <AiOutlineHome />
            </a>
          </div>
          <div className="title-text">
            <div ref={loginTextRef} className="title login">
              <img
                src={Logo}
                width={100}
                height={100}
                alt=""
                style={{ borderRadius: '50%', marginTop: "-18px" }}
              />
            </div>
            <div className="title signup">
              <img
                src={Logo}
                width={100}
                height={100}
                alt=""
                style={{ borderRadius: '50%' }}
              />
            </div>
          </div>
          <div className="form-container">
            <div className="slide-controls">
              <input type="radio" name="slide" id="login" checked />
              <input type="radio" name="slide" id="signup" />
              <label
                onClick={handleLoginClick}
                ref={loginBtnRef}
                htmlFor="login"
                className="slide login"
              >
                <AiOutlineUser /> Connection
              </label>
              <label
                onClick={handleSignupClick}
                ref={signupBtnRef}
                htmlFor="signup"
                className="slide signup"
              >
                <AiOutlineUserAdd /> Registration
              </label>
              <div className="slider-tab"></div>
            </div>
            <div className="form-inner">
              <form
                onSubmit={handleSubmit}
                ref={loginFormRef}
                action="#"
                className="login"
              >
                <div className="fieldd">
                  <input
                    type="email"
                    name="email"
                    placeholder="Adresse Email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                  />
                  {credentials.email === '' && <p style={{ color: 'red', fontStyle: 'italic', textAlign: "left", fontSize: "10px" ,marginTop:"30px" }}>exempls@email.com</p>}
                  
                </div>
                <div className="fieldd">
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                    required
                    style={{marginTop:"10px"}}
                  />
                  {credentials.password === '' && <p style={{ color: 'red', fontStyle: 'italic', textAlign: "left", fontSize: "10px" }}>password required</p>}
                </div>
                <br/>
                <div class="row mb-4">
                  <div class="col-md-6 d-flex justify-content-center">
                    <div class="form-check mb-3 mb-md-0">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="loginCheck"
                        name="rememberMe"
                        
                        style={{marginTop:"20px"}}
                      />
                      <label class="form-check-label" for="loginCheck" style={{fontSize:"14px" ,marginTop:"20px" }}> Remember me </label>
                    </div>
                  </div>
                  <div class="col-md-6 d-flex justify-content-center " style={{fontSize:"14px",marginTop:"20px"}}>
                    <a href="/forget">Forgot password ?</a>
                  </div>
                  <div className="field" style={{  height:"10px"}}>
                      <ReCAPTCHA
                        sitekey="6LdCUpMpAAAAAGsKJjIwRd8qAEDM7JiCD0Cq_tTv"
                        onChange={() => setIsLoaded(false)} 
                      />
                    </div> 
                </div>
                
                <button
                  type="submit"
                  className="btn"
                  disabled={isSubmitting}
                  style={{ borderRadius: "50px", height: "45px", marginTop: "70px" }}
                >
                  {!isLoaded ? (
                    <React.Fragment>Se connecter</React.Fragment>
                  ) : (
                    <div className="text-white d-flex container justify-content-center align-items-center">
                      <div className="donut mx-2"></div> En cours de
                      connection
                    </div>
                  )}
                </button>
                <div className="signup-link">
                  <small>Pas envie de s'inscrire</small> ?{""}
                  <a href="#a" onClick={handleSignupLinkClick}>
                    <small>
                      {" "}
                      <AiOutlineUserSwitch /> Connexion en tant qu'invité
                    </small>
                  </a>
                            <GoogleLogin
                  clientId={CLIENT_ID}
                  buttonText="Se connecter avec Google"
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  cookiePolicy={'single_host_origin'}
                  uxMode="redirect" // Utiliser la redirection au lieu de pop-up
                  redirectUri="http://localhost:3000" // Remplacez par votre URL de redirection
                />
                      <div className="login-buttons">
                        <button  className="google-login-btn">
                          <FcGoogle />
                        </button>
                        <button className="facebook-login-btn">
                          <FaFacebook />
                        </button>
                      </div>
                    {/* )}
                  /> */}
                  <div>
                    {token && <p>Token: {token}</p>}
                  </div>
                </div>
              </form>
              <RegisterSection />
            </div>
          </div>
        </div>

        <Copyright />
      </div>
    </React.Fragment>

  );
}

export default Signin;

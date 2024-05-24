import React, { Fragment, useState, useRef ,useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./ForgetPassword.module.css";
import brand4 from "../../assets/brand4.png";
import brand5 from "../../assets/brand5.png";
import brand6 from "../../assets/brand6.png";
import { Toaster, toast } from "react-hot-toast";
import pass from "../../assets/lock-solid.svg";
import check from "../../assets/check-solid.svg";
import "./ForgetPassword.module.css";
import { AiOutlineHome, AiOutlineLock } from "react-icons/ai";
import Logo from "../../assets/logo5.png";
import Copyright from "../Footer/Copyright";
import "../ActivateAccount/style.css";
import email from "../../assets/envelope-solid.svg";

const ForgetPassword = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoaded1, setIsLoaded1] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Unique déclaration de la variable
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    let newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  
    if (value.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
    updatePasswordStrength(value); // Appel correct de la fonction updatePasswordStrength
  };
  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsButtonDisabled(!isValidEmail(newEmail));
    setIsLoaded(false);
  };

  const handleEmailSubmission = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/forgotPwd`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        setIsLoaded(true);
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
        setIsLoaded(true);
        setTimeout(() => {
          toast.remove(toast1);
          setStep(2);
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

  const verifyCode = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/verifCode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            activationCodeForgotPass: code[0] + code[1] + code[2] + code[3],
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        setIsLoaded1(true);

        const toast2 = toast.success(responseData.message, {
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
          toast.remove(toast2);
          setStep(3);
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

  const resendCode = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/resendForgotCode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({}),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        toast.success(responseData.message, {
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

  const handleNewPassword = async () => {
    setIsSubmitting(true);
    try {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#])(?=.{6,})/;
      // Vérifier si le mot de passe respecte les critères requis
      if (!passwordRegex.test(newPassword)) {
        throw new Error(
          "Le mot de passe doit contenir au moins une minuscule, une majuscule, un caractère '@' ou '#' et avoir une longueur minimale de 6 caractères"
        );
      }

      // Vérifier si les deux mots de passe correspondent
      if (newPassword !== confirmNewPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      // Votre logique de réinitialisation du mot de passe ici
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/resetPwd`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          password: newPassword,
          confirmPassword: confirmNewPassword,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        setIsLoaded(false);
        throw new Error(responseData.message || responseData.error);
      } else {
        const toast3 = toast.success(responseData.message, {
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
          toast.remove(toast3);
          navigate("/login");
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
    } finally {
      setIsSubmitting(false);
    }
  };
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "red";
      case 2:
      case 3:
        return "orange";
      case 4:
      case 5:
        return "green";
      default:
        return "red";
    }
  };

  const barBackgroundColor = passwordStrength <= 1 ? "red" : "white";

  const updatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 6) strength += 1;

    if (/[a-z]/.test(password)) strength += 1;

    if (/[A-Z]/.test(password)) strength += 1;

    if (/[@#]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  };
  const isCodeFilled = () => {
    return code.every((value) => value !== ""); // Vérifie si tous les champs ne sont pas vides
  };
  useEffect(() => {
    if (isCodeFilled()) {
      verifyCode(); 
    }
  }, [code]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsButtonDisabled(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isButtonDisabled]);
  return (
    <section
      className="paper"
      style={{
        backgroundColor: "#FA8072",
        height: "100vh",
        position: "relative",
      }}
    >
      {step === 1 ? (
        <section
          style={{ marginTop: 0, position: "relative" }}
          className=" wrapper justifyc-content-center align-items-center  bg-light  w-50"
        >
          <div>
            <Toaster gutter={20} />
          </div>
          <div>
            <div className="d-flex justify-content-start align-items-start">
              <a
                title="Revenir en accueil"
                style={{ color: "#f88f8f", fontSize: 24 }}
                href="/"
              >
                <AiOutlineHome />
              </a>
            </div>
            <div className="row">
              <div className="col-md-12">
                <center>
                  <img
                    src={Logo}
                    width={100}
                    height={100}
                    alt=""
                    style={{ borderRadius: '50%', marginTop: "-18px" }}
                    className="mb-4" 
                  />
                  <div className="mb-4">
                    <h5>Mot de passe oublié </h5>
                    <p className="mb-2">Entrez votre identifiant email enregistré pour réinitialiser le mot de passe.</p>
                  </div>
                </center>
  
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEmailSubmission();
                  }}
                >
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <div className="inputContainer">
                      <input
                        type="email"
                        className="form-control"
                        style={{
                          height: 50,
                          border: "1px solid #f88f8f",
                          width: "100%",
                        }}
                        id="email"
                        name="email"
                        placeholder="Entrez votre email :"
                        value={email}
                        onChange={handleEmailChange}
                      />
                    </div>
                    <br />
                    <button
                      style={{ borderRadius: 100, height: 50 }}
                      type="submit"
                      className="btn btn-primary w-40 rounded-pill"
                      disabled={isButtonDisabled || isLoaded} 
                    >
                      {!isLoaded ? (
                        <React.Fragment>Chercher Votre compte</React.Fragment>
                      ) : (
                        <div className="text-white d-flex container justify-content-center align-items-center">
                          <div className="donut mx-2"></div>
                          Veuillez patienter
                        </div>
                      )}
                    </button>
                  </div>
                </form>
                <div className="pass-link mt-3 d-flex justify-content-center">
                  <a href="/login" className="text-dark">
                    <small>Mot de passe oublié ? Connectez-vous</small>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
      {step === 2 ? (
        <section className="forget mt-4">
          <div>
            <Toaster gutter={20} />
          </div>
  
          <div className="container bg-light my-7">
            <div className="d-flex justify-content-start align-items-start">
              <a
                title="Revenir en accueil"
                style={{ color: "#FA8072", fontSize: 24 }}
                href="/"
              >
                <AiOutlineHome />
              </a>
            </div>
            <div className="code-container" style={{ marginTop: -20, fontSize: 30 }}>
              <div className="row">
                <div className="col-md-12 p-5">
                  <center>
                    <img
                      src={Logo}
                      width={100}
                      height={100}
                      alt=""
                      style={{ borderRadius: '50%', marginTop: "-18px" }}
                    />
                    <br />
                    <p className="mb-5">Code de validation</p>
                  </center>
  
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      verifyCode();
                    }}
                  >
                    <div style={{ marginTop: -50 }}>
                      <div className="row">
                        <div className="col-12">
                          <div className="code-container">
                            {code.map((value, index) => (
                              <input
                                key={index}
                                className="code"
                                placeholder="0"
                                type="text"
                                pattern="^[0-9]$"
                                maxLength="1"
                                required
                                value={value}
                                ref={inputRefs[index]}
                                onChange={(e) => handleInputChange(e, index)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: 0 }} className="mt-5">
                        {isCodeFilled() && !isLoaded1 && (
                          <center>
                            <div className="notification">
                              Vérification automatique en cours...
                            </div>
                          </center>
                        )}
                      </div>  
                      </div>
                    <div style={{ marginTop: 0 }} className="mt-5">
                      <center>
                        <button
                          style={{ borderRadius: 100, height: 50 }}
                          type="submit"
                          onClick={resendCode}
                          className={`btn mt-4 rounded-pill ${styles.resend}`}
                          disabled={isButtonDisabled}
                        >
                          <React.Fragment>  Réenvoyer le code</React.Fragment>
                        </button>
                      </center>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
      {step === 3 ? (
        <section className="forget mt-4">
          <div>
            <Toaster />
          </div>
  
          <section
            style={{ marginTop: 0, position: "relative" }}
            className="wrapper justifyc-content-center align-items-center bg-light w-100"
          >
            <div className="d-flex justify-content-start align-items-start">
              <a
                title="Revenir en accueil"
                style={{ color: "#FA8072", fontSize: 24 }}
                href="/"
              >
                <AiOutlineHome />
              </a>
            </div>
            <div className="row">
              <div className="col-md-12">
                <center>
                  <img
                    src={Logo}
                    width={100}
                    height={100}
                    alt=""
                    style={{ borderRadius: '50%', marginTop: "-18px" }}
                  />
                  <p className="mb-2">ici pour changer votre mot de passe</p>
                </center>
                <form
                    className={styles.resetForm}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleNewPassword();
                    }}
                  >
                    <div className="mb-3">
                      <div className="inputContainer">
                        <AiOutlineLock className="icon" />
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          name="password"
                          placeholder="Nouveau mot de passe"
                          style={{
                            height: 40,
                            border: "1px solid #f88f8f",
                            width: "100%",
                          }}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            updatePasswordStrength(e.target.value);
                          }}
                        />
                      </div>
                     
                    {/* {newPassword && (
                      <progress
                        value={passwordStrength}
                        max="5"
                        style={{
                          width: "50%",
                          height: "8px",
                          marginTop: "5px",
                          borderRadius: "50%",
                          background: barBackgroundColor,
                          boxShadow: "0 0 80px white",
                          WebkitAppearance: "none",
                          appearance: "none",
                          background: `linear-gradient(to right, ${getPasswordStrengthColor()} ${passwordStrength * 20}%, white ${passwordStrength * 20}%)`,
                        }}
                      ></progress>
                    )} */}
                      <div className="inputContainer">
                        <AiOutlineLock className="icon" />
                        <input
                          type="password"
                          className="form-control"
                          id="confirmpassword"
                          name="confirmpassword"
                          placeholder="Confirmer le nouveau mot de passe"
                          style={{
                            height: 50,
                            border: "1px solid #f88f8f",
                            width: "100%",
                          }}
                          value={confirmNewPassword}
                          onChange={(e) => {
                             setConfirmNewPassword(e.target.value)
                             updatePasswordStrength(e.target.value);
                            }}
                        />
                      </div>
                      {/* {confirmNewPassword && (
                      <progress
                        value={passwordStrength}
                        max="5"
                        style={{
                          width: "50%",
                          height: "8px",
                          marginTop: "5px",
                          borderRadius: "50%",
                          background: barBackgroundColor,
                          boxShadow: "0 0 80px white",
                          WebkitAppearance: "none",
                          appearance: "none",
                          background: `linear-gradient(to right, ${getPasswordStrengthColor()} ${passwordStrength * 20}%, white ${passwordStrength * 20}%)`,
                        }}
                      ></progress>
                    )} */}
                      <center>
                      <button
                       style={{ borderRadius: "50px", height: "45px", marginTop: "10px" }}
                        type="submit"
                        className="btn btn-primary mt-3 rounded-pill"
                      >
                      {!isLoaded ? (
                        <React.Fragment></React.Fragment>
                      ) : (
                        <div className="text-white d-flex justify-content-center align-items-center"  >
                        
                        <span  style={{paddingTop:"5px"}}>Veuillez patienter</span>
                      </div>
                      
                      )}
                    </button>
                     
                      </center>
                    </div>
                  </form>

              </div>
            </div>
          </section>
  
        </section>
      ) : null}
  
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 80,
          left: 80,
          "@media (max-width: 600px)": {
            bottom: 80,
            right: 20,
            left: 20,
          },
          "@media (max-width: 400px)": {
            bottom: 60,
            right: 10,
            left: 10,
          },
        }}
      >
        <Copyright />
      </div>
    </section>
  );
      }
      export default ForgetPassword;  
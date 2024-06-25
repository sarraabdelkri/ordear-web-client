import React, { useReducer, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./SignUp.module.css";
import styles from "./SignUp.module.css";
import ReCAPTCHA from "react-google-recaptcha";
import Modal from "react-modal";
import axios from "axios";

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordVerify: "",
};

const formReducer = (state, action) => {
  if (action.type === "CHANGE_INPUT") {
    return {
      ...state,
      [action.payload.name]: action.payload.value,
    };
  }
  return state;
};

function RegisterSection() {
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name, value },
    });
    if (name === "password") {
      updatePasswordStrength(value);
    }
  };

  const updatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[*@#]/.test(password)) strength += 1;
    setPasswordStrength(strength);
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

  const fetchSignup = async (e) => {
    e.preventDefault();
    setIsLoaded(true);

    if (state.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères", {
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
      setIsSubmitting(false);
      setTimeout(() => {
        setIsLoaded(false);
      }, 2000);
      return;
    }

    if (state.password !== state.passwordVerify) {
      toast.error("Les mots de passe ne correspondent pas", {
        style: {
          border: "1px solid #FA8072",
          padding: "10px",
          color: "#FA8072",
        },
        iconTheme: {
          primary: "#FA8072",
          secondary: "#f88f8f",
        },
      });
      setTimeout(() => {
        setIsLoaded(false);
      }, 2000);
      return;
    }

    const containsLowercase = /[a-z]/.test(state.password);
    const containsUppercase = /[A-Z]/.test(state.password);
    const containsSpecialChars = /[@#]/.test(state.password);
    const containsNumbers = /\d/.test(state.password);

    if (!containsSpecialChars) {
      toast.error(
        "Le mot de passe doit contenir au moins un des caractères spéciaux '@' ou '#'",
        {
          style: {
            border: "1px solid #FA8072",
            padding: "10px",
            color: "#FA8072",
          },
          iconTheme: {
            primary: "#FA8072",
            secondary: "#f88f8f",
          },
        }
      );
      setTimeout(() => {
        setIsLoaded(false);
      }, 2000);
      return;
    }

    if (!containsLowercase || !containsUppercase) {
      toast.error(
        "Le mot de passe doit contenir au moins une lettre minuscule et une lettre majuscule",
        {
          style: {
            border: "1px solid #FA8072",
            padding: "10px",
            color: "#FA8072",
          },
          iconTheme: {
            primary: "#FA8072",
            secondary: "#f88f8f",
          },
        }
      );

      setTimeout(() => {
        setIsLoaded(false);
      }, 2000);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/registerClientWeb`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(state),
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        // Enregistrer les informations de l'utilisateur dans le local storage
        localStorage.setItem(
          "userCredentials",
          JSON.stringify({
            firstName: state.firstName,
            lastName: state.lastName,
            email: state.email,
          })
        );

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
        }, 2000);
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
      setIsLoaded(false);
    }
  };

  const toggleModal = () => {
    setShowPopup(!showPopup);
    fetchPrivacyPolicy();
  };

  const fetchPrivacyPolicy = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/privacyPolicy`
      );
      setPrivacyPolicy(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la politique de confidentialité :",
        error
      );
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  return (
    <React.Fragment>
      <Toaster />
      <form onSubmit={fetchSignup} className="signup">
        <div className="row">
          <div className="col-6">
            <div className="field">
              <input
                id="firstname"
                name="firstName"
                onChange={handleChange}
                type="text"
                placeholder="Prénom"
                value={state.firstName}
                required
              />
              {!state.firstName && <p style={{ color: 'red', fontStyle: 'italic', fontSize: '10px'}}>Prénom requis</p>}
            </div>
          </div>
          <div className="col-6">
            <div className="field">
              <input
                id="lastname"
                name="lastName"
                onChange={handleChange}
                type="text"
                placeholder="Nom"
                value={state.lastName}
                required
              />
              {!state.lastName && <p style={{ color: 'red', fontStyle: 'italic', fontSize: '10px'}}>Nom requis</p>}
            </div>
          </div>
        </div>
        <div className="field">
          <input
            id="email"
            name="email"
            onChange={handleChange}
            type="email"
            placeholder="Adresse Email"
            value={state.email}
            required
          />
          {!state.email && <p style={{ color: 'red', fontStyle: 'italic', fontSize: '10px'}}>Adresse email requise</p>}
        </div>
        <div className="field">
          <input
            id="password"
            name="password"
            onChange={handleChange}
            type="password"
            placeholder="Mot de passe"
            value={state.password}
            required
          />
          {!state.password && <p style={{ color: 'red', fontStyle: 'italic', fontSize: '10px'}}>Mot de passe requis</p>}
          {/* {state.password && (
            <progress
              value={passwordStrength}
              max="5"
              style={{
                width: "50%",
                height: "8px",
                marginTop: "5px",
                borderRadius: "50%",
                background: getPasswordStrengthColor(),
                boxShadow: "0 0 80px white",
                WebkitAppearance: "none",
                appearance: "none",
              }}
            ></progress>
          )} */}
        </div>
        <div className="field">
          <input
            id="confirmPassword"
            name="passwordVerify"
            onChange={handleChange}
            type="password"
            placeholder="Confirmer le mot de passe"
            value={state.passwordVerify}
            required
          />
          {!state.passwordVerify && <p style={{ color: 'red', fontStyle: 'italic', fontSize: '10px'}}>Confirmation du mot de passe requise</p>}
        </div>
        <div className="form-check d-flex justify-content-center mb-5">
        {showPopup && (
            <Modal
              isOpen={showPopup}
              onRequestClose={() => setShowPopup(false)}
              contentLabel="Politique de confidentialité"
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
                content: {
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "80%",
                  maxWidth: "600px",
                  maxHeight: "80vh",
                  overflowY: "auto",
                  padding: "20px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#fff",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <span className="close" onClick={handleClosePopup}>&times;</span>
              <div>
              
                <p>
                  <div className="privacy-policy">
                    {privacyPolicy && (
                      <>
                        <h2>{privacyPolicy.title}</h2>
                        <p>Dernière mise à jour : {new Date(privacyPolicy.updatedAt).toLocaleString()}</p>
                        <p>{privacyPolicy.content}</p>

                        <h3>{privacyPolicy.informationsCollectees}</h3>
                        <p>{privacyPolicy.clients.content}</p>
                        <p>{privacyPolicy.equipeRestaurant.content}</p>
                        <p>{privacyPolicy.responsablesFranchise.content}</p>

                        <h3>{privacyPolicy.utilisationInformations.title}</h3>
                        <p>{privacyPolicy.utilisationInformations.content}</p>

                        <h3>{privacyPolicy.partageInformations.title}</h3>
                        <p>{privacyPolicy.partageInformations.content}</p>

                        <h3>{privacyPolicy.securiteDonnees.title}</h3>
                        <p>{privacyPolicy.securiteDonnees.content}</p>

                        <h3>{privacyPolicy.vosChoix.title}</h3>
                        <p>{privacyPolicy.vosChoix.content}</p>

                        <h3>{privacyPolicy.modificationsPolitique.title}</h3>
                        <p>{privacyPolicy.modificationsPolitique.content}</p>

                        <h3>{privacyPolicy.nousContacter.title}</h3>
                        <p>{privacyPolicy.nousContacter.content}</p>
                      </>
                    )}
                  </div>
                </p>
                <button onClick={handleClosePopup} style={{ borderRadius: "30px", marginLeft: "80%" }}>Accepter</button>
              </div>
            </Modal>
          )}

          <label className="form-check-label d-flex align-items-center" htmlFor="form2Example3" style={{ marginTop: "50px", marginLeft: "-50px" }}>
            <input
              className="form-check-input me-2"
              type="checkbox"
              value=""
              id="form2Example3c"
            />
            <span onClick={toggleModal} style={{ cursor: "pointer", fontSize: "12px", marginTop: "10px" }}>
              J'accepte tous les termes de <a href="#" style={{ color: "salmon", fontWeight: "bold" }}>conditions d'utilisation</a>
            </span>
            .
          </label>
        </div>

        <button
          type="submit"
          className="btn"
          disabled={isLoaded}
          style={{ borderRadius: "50px", height: "40px", marginTop: "-40px" }}
        >
          {!isLoaded ? (
            <React.Fragment>Créer votre compte</React.Fragment>
          ) : (
            <div className="text-white d-flex container justify-content-center align-items-center">
              <div className="donut mx-2"></div> En cours de vérification
            </div>
          )}
        </button>
      </form>
    </React.Fragment>
  );
}

export default RegisterSection;

import styles from "./EditProfile.module.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import close from "../../assets/xmark-solid.svg";
import { useReducer, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { AiFillCheckCircle } from "react-icons/ai";
import avatar from "../../assets/avatar.png";

const formReducer = (state, action) => {
  if (action.type === "CHANGE_INPUT") {
    return {
      ...state,
      [action.payload.name]: action.payload.value,
    };
  }
};

const EditProfile = (props) => {
  const initialFormState = {
    firstName: props.profile.firstName,
    email: props.profile.email,
    lastName: props.profile.lastName,
    address: props.profile.address,
    birthday: props.profile.birthday,
    phone: props.profile.phone,
  };
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const [image, setImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleChange = (e) => {
    if (e.target.name !== "email") {
      dispatch({
        type: "CHANGE_INPUT",
        payload: { name: e.target.name, value: e.target.value },
      });
    }
  };

  const handlePhoneChange = async (phone) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: "phone", value: phone },
    });
  };

  const handlePhoneKeyPress = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handlePhoneChange(state.phone);
      try {
        await sendSMS(state.phone, "Votre code de vérification est : ");
        setShowPopup(true); // Show the popup for verification code
      } catch (error) {
        console.error(error);
        toast.error("Une erreur s'est produite lors de l'envoi du code de vérification par SMS.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/user/${userId}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...state,
            phone: state.phone[0] === "+" ? state.phone : "+" + state.phone,
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        toast.success(responseData.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };


  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/verifyCodeWeb`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          verificationCode: verificationCode,
        }),
      });
  
      const responseData = await response.json();
      if (response.ok) {
        toast.success("Votre numéro de téléphone a été mis à jour avec succès !");
        updatePhoneNumber(); // Update phone number after verification
      } else {
        throw new Error(responseData.error || "Code de vérification invalide.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite lors de la soumission du code de vérification.");
    }
  };

  const updatePhoneNumber = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/updatePhoneWeb`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            phone: state.phone[0] === "+" ? state.phone : "+" + state.phone,
            code: verificationCode // Envoyer le code de vérification avec la demande de mise à jour
          }),
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
 
        setTimeout(() => {
          props.closeModal();
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message, {
        style: {
          border: "1px solid #FA8072",
          padding: "16px",
          color: "#f88f8f",
        },
        iconTheme: {
          primary: "#FA8072",
          secondary: "#f88f8f",
        },
      });
    }
  };

  const sendSMS = async (phoneNumber, message) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/sendSMSWeb`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            phoneNumber,
            message,
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to send SMS');
    }
  };

const getImage = async () => {
  try {
      const userId = localStorage.getItem('userId'); // Récupérer userId depuis le localStorage

      if (!userId) {
          throw new Error("User ID not found in local storage");
      }

      const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/user/getImageByUserId/${userId}`,
          {
              credentials: "include",
          }
      );

      if (!response.ok) {
          const responseData = await response.json();
          throw new Error(responseData.message || responseData.error);
      } else {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setImage(url);
      }
  } catch (err) {
      console.log(err.message);
  }
};


  useEffect(() => {
    getImage();
  }, []);

  return (
    <div className={`${styles.backdrop} ${styles.card}`} onClick={props.closeModal}>
      <div style={{ backgroundColor: "#fff" }} className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.top}>
          <h3 className="mt-4">Mettre à jour mes informations</h3>
          <img src={close} alt="close" onClick={props.closeModal} />
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={`mt-3 ${styles.imageSection} d-flex flex-column align-items-center`}>
            <img src={image || avatar} alt="avatar" className={`${styles.avatar} ${styles.roundedImage}`} />
            <b>Photo de profil</b>
          </div>

          <div className="py-2">
            <div className="row py-2">
              <div className="col-md-6">
                <label htmlFor="firstname">Prénom</label>
                <input
                  type="text"
                  className="bg-light form-control"
                  name="firstName"
                  value={state.firstName}
                  onChange={handleChange}
                  placeholder="Prénom"
                />
              </div>
              <div className="col-md-6 pt-md-0 pt-3">
                <label htmlFor="lastname">Nom de famille</label>
                <input
                  type="text"
                  className="bg-light form-control"
                  name="lastName"
                  value={state.lastName}
                  onChange={handleChange}
                  placeholder="Nom de famille"
                />
              </div>
            </div>
            <div className="row py-2">
              <div className="col-md-6">
                <label htmlFor="email">Adresse e-mail</label>
                <input
                  type="email"
                  className="bg-light form-control"
                  name="email"
                  value={state.email}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="phone" className="mr-2">Numéro de téléphone</label>
                <div className="d-flex align-items-center">
                  <PhoneInput
                    country="ca"
                    value={state.phone}
                    onChange={(phone) => handlePhoneChange(phone)}
                    onKeyPress={handlePhoneKeyPress}
                    inputProps={{
                      name: 'phone',
                      className: 'bg-light form-control',
                      placeholder: '+1234567890',
                      style: { width: "100%" }
                    }}
                  />
                </div>
              </div>
              <div className="row py-2">
                <div className="col-md-6">
                  <label htmlFor="address">Adresse</label>
                  <input
                    type="text"
                    className="bg-light form-control"
                    name="address"
                    value={state.address}
                    onChange={handleChange}
                    placeholder="123 rue principale"
                  />
                </div>
                <div className="col-md-6 pt-md-0 pt-3">
                  <label htmlFor="birthday">Date de naissance</label>
                  <input
                    type="date"
                    className="bg-light form-control"
                    name="birthday"
                    value={state.birthday}
                    onChange={handleChange}
                    placeholder="yyyy-MM-dd"
                  />
                </div>
              </div>
            </div>
          </div>
          <button className={styles["button-3"]} type="submit">
            <AiFillCheckCircle />
            &nbsp; Valider les changements
          </button>
        </form>
        {showPopup && (
          <div className={`${styles.backdrop} ${styles.card}`} onClick={props.closeModal}>
            <div style={{ backgroundColor: "#fff" }} className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <span className={styles.close} onClick={() => setShowPopup(false)}>&times;</span>
              <div className={styles.top} style={{marginLeft:"250px", }}>
                <h2 style={{fontSize:"25px"}}>Entrez votre code de vérification</h2>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <form onSubmit={handleVerificationSubmit} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <input
                      type="text"
                      placeholder="Code de vérification"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        fontSize: '1rem',
                        border: '1px solid ',
                        borderRadius: '20px' // Ajout de la bordure
                      }}
                    />
                  </div>
                  <div>
                    <button type="submit" style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#FA8072',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}>
                      Soumettre
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;

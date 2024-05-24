import { useState } from "react";
import styles from "./EditProfile.module.css";
import { toast } from "react-hot-toast";
import close from "../../assets/xmark-solid.svg";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import authSlice from "../../store/authSlice";
import { AiFillCheckCircle } from "react-icons/ai";
import zxcvbn from "zxcvbn"; 

const EditPassword = (props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    const strength = zxcvbn(newPassword).score;
    setPasswordStrength(strength);
  };

  const fetchEditPassword = async () => {
    try {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#]).{6,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères avec au moins une lettre minuscule, une lettre majuscule et un caractère spécial parmi '@' et '#' ");
      }
      
      if (oldPassword === password) {
        throw new Error("Le nouveau mot de passe doit être différent de l'ancien mot de passe.");
      }
      if (passwordStrength < 3) {
        throw new Error(
          "Le mot de passe est trop faible. Veuillez choisir un mot de passe plus sécurisé."
        );
      }
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/updatePasswordWeb`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            oldPassword,
            password,
            confirmPassword,
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
        setShowConfirmation(true);
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

  const logout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
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
    props.closeModal();
  };

  return (
    <div className={styles.backdrop} onClick={props.closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.top}>
          <h3 className="mt-4" style={{ marginTop: "20px", textAlign: "center", margin: "auto" }}>
            Modifier mon mot de passe
          </h3>
          <img src={close} alt="close" onClick={props.closeModal} />
        </div>

        {!showConfirmation ? (
          // Modèle pour modifier le mot de passe
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              fetchEditPassword();
            }}
          >
            <div className={styles.inputContainer}>
              <input
                type="password"
                value={oldPassword}
                className={styles.input}
                placeholder="Ancien mot de passe"
                onChange={(e) => setOldPassword(e.target.value)}
              />

                {!oldPassword && (
                  <div style={{ color: 'red', fontStyle: 'italic', textAlign: 'left', fontSize: "10px" }}>
                  saisir votre ancien mot de passe
                  </div>  
                )}
                </div>


                 <div className={styles.inputContainer}>
            <input
              type="password"
              value={password}
              className={styles.input}
              placeholder="Nouveau mot de passe"
              onChange={handlePasswordChange} 
            />
            
            <progress
              value={passwordStrength}
              max="4"
              style={{
                width: "50%",
                height: "8px",
                marginTop: "5px",
                marginRight: "-50px",
                borderRadius: "50%", 
                boxShadow: "0 0 80px white", 
                WebkitAppearance: "none",
                appearance: "none",
                background: `linear-gradient(to right, red ${passwordStrength * 25}%, green ${passwordStrength * 25}%)`
              }}
            ></progress>
          </div>

          <div className={styles.inputContainer}>
            <input
              type="password"
              value={confirmPassword}
              className={styles.input}
              placeholder="Confirmer le nouveau mot de passe"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>


            <button className={styles["button-3"]} type="submit">
              <AiOutlineCheckCircle /> Valider les changements
            </button>
          </form>
        ) : (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <p>Voulez-vous rester connecté ou vous déconnecter ?</p>
            <button className="btn btn" style={{ backgroundColor: "#FA8072", color: "#fff" }} onClick={logout}>
              <AiFillCheckCircle /> Déconnexion
            </button>
            <button className="btn btn  ml-2" style={{ backgroundColor: "#FA8072", color: "#fff" }} onClick={props.closeModal}>
              <AiFillCheckCircle /> Rester connecté
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPassword;

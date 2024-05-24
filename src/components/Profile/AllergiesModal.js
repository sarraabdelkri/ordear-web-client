import React, { useState } from "react";
import { toast } from "react-hot-toast";
import close from "../../assets/xmark-solid.svg";
import { AiOutlineCheckCircle } from "react-icons/ai";
import styles from "./EditProfile.module.css"; // Assurez-vous de définir les styles CSS appropriés
import AllergiesList from "./AllergiesList ";


const EditAllergies = (props) => {
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  const handleSaveAllergies = async () => {
    try {
      // Effectuez ici votre logique pour sauvegarder les allergies sélectionnées
      console.log("Allergies sélectionnées :", selectedAllergies);
      toast.success("Allergies enregistrées avec succès");
      props.closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Une erreur s'est produite lors de l'enregistrement des allergies");
    }
  };

  const handleAllergySelection = (allergy) => {
    const isSelected = selectedAllergies.includes(allergy);
    if (isSelected) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  return (
    <div className={styles.backdrop} onClick={props.closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.top}>
          
          <img src={close} alt="close" onClick={props.closeModal} />
        </div>

        <AllergiesList selectedAllergies={selectedAllergies} onSelectAllergy={handleAllergySelection} />

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveAllergies();
          }}
        >
          <button className={styles["button-3"]} type="submit">
            <AiOutlineCheckCircle /> Enregistrer les allergies
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAllergies;
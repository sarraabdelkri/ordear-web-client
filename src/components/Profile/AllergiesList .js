import React, { useState } from "react";

const AllergiesList = () => {
  // Liste d'allergies disponibles
  const allergies = [
    "Arachides",
    "Fruits de mer",
    "Lactose",
    "Gluten",
    "Oeufs",
    "Soja",
    "Noix",
    "Poisson",
    // Ajoutez d'autres allergies selon vos besoins
  ];

  // État pour stocker les allergies sélectionnées par l'utilisateur
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  // Fonction pour gérer la sélection d'une allergie
  const handleAllergySelection = (allergy) => {
    // Vérifie si l'allergie est déjà sélectionnée
    const isSelected = selectedAllergies.includes(allergy);
    // Si elle est déjà sélectionnée, la retire de la liste
    if (isSelected) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== allergy));
    } else {
      // Sinon, l'ajoute à la liste
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  return (
    <div>
      <h2>Liste des allergies disponibles</h2>
      <ul>
        {allergies.map((allergy, index) => (
          <li key={index}>
            <label>
              <input
                type="checkbox"
                checked={selectedAllergies.includes(allergy)}
                onChange={() => handleAllergySelection(allergy)}
              />{" "}
              {allergy}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllergiesList;

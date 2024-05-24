import { useHistory } from "react-router-dom";
import styles from "../Home/Home.module.css";
import Navs from "../Navs/Navs.js";
import Header from "../Home/Header.js";
import React, { useState, useEffect } from "react";

const SearchResultsPage = () => {
 
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/menu/search?term=${searchTerm}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }
      const data = await response.json();
      console.log("Données des restaurants récupérées :", data); // Ajout du console.log
      setRestaurants(data);
      
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [searchTerm]);

  return (
    <section className={styles.firstPage}>
      <Navs />
      <Header />
      <section>
        <div>
          {restaurants.map((restaurant, index) => (
            <div key={index} className="card">
              <h2>{restaurant.nameRes}</h2>
              <p>Adresse: {restaurant.address}</p>
              {/* Ajoutez d'autres informations sur le restaurant */}
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default SearchResultsPage;

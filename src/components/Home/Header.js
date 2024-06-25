import React, { useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import Modal from "react-modal";
import styles from "./Header.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faUtensils } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement("#root");

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("nameRes");
  const [suggestions, setSuggestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const settingss = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/restaurant/search`, {
        params: { [searchType]: searchQuery },
      });

      if (response.data && response.data.length > 0) {
        setSuggestions(response.data);
        setIsModalOpen(true);
      } else {
        alert("Restaurant not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Error searching for restaurant:", error);
      alert("Error searching for the restaurant. Please try again.");
    }
  };

  const handleSuggestionClick = (restaurantId) => {
    setIsModalOpen(false);
    navigate(`/search/${restaurantId}`);
  };

  return (
    <>
      <header className="header">
        <section className="slider_section">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto" style={{ marginTop: "200px", fontWeight: "lighter", textAlign: "center" }}>
                <div className="detail-box">
                  <h1>Savor the Extraordinary</h1>
                  <p>
                    Discover a world of dining experiences and culinary delights. Instead of focusing on the typical layout,
                    immerse yourself in the diverse and vibrant flavors that await you.
                  </p>
                </div>
                <div className="find_container">
                  <div className="container">
                    <div className="row">
                      <div className="col" style={{ display: "flex", justifyContent: "center" }}>
                        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                          <div className={styles.formGroup}>
                            <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className={styles.searchSelect}>
                              <option value="nameRes">Name</option>
                              <option value="address">Address</option>
                              <option value="cuisineType">Specialty</option>
                            </select>
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className={styles.searchInput}
                              placeholder="Enter your search term"
                            />
                          </div>
                          <button type="submit" className={styles.searchButton}>
                            Search
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      <Slider {...settings} dots={false} autoplay autoplaySpeed={1500} cssEase="ease-out" arrows={false} style={{ marginTop: "100px", marginLeft: "100px" }}>
            <div className="item">
              <div className="img-box">
                <img src="https://www.myeatpal.com/assets/foods/food_01.png" alt="" style={{ width: "100%", height: "auto", maxWidth: "300px" }} />
              </div>
            </div>
            <div className="item">
              <div className="img-box">
                <img src="https://www.myeatpal.com/assets/foods/food_04.png" alt="" style={{ width: "100%", height: "auto", maxWidth: "300px" }} />
              </div>
            </div>
            <div className="item">
              <div className="img-box">
                <img src="https://www.myeatpal.com/assets/dishes/dish_11.png" alt="" style={{ width: "100%", height: "auto", maxWidth: "300px" }} />
              </div>
            </div>
            <div className="item">
              <div className="img-box">
                <img src="https://www.myeatpal.com/assets/foods/food_00.png" alt="" style={{ width: "100%", height: "auto", maxWidth: "300px" }} />
              </div>
            </div>
            <div className="item">
              <div className="img-box">
                <img src="https://www.myeatpal.com/assets/foods/food_05.png" alt="" style={{ width: "100%", height: "auto", maxWidth: "300px" }} />
              </div>
            </div>
          </Slider>
        </section>
      </header>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Restaurant Suggestions"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2 style={{ fontWeight: "bold", marginBottom: "10%" }}>Restaurant Suggestions</h2>
        <Slider {...settingss}>
          {suggestions.map((restaurant) => (
            <div key={restaurant._id} className={styles.restaurantCard} onClick={() => handleSuggestionClick(restaurant._id)}>
              <img
                src={`https://backend.themenufy.com/uploads/resto/${restaurant.logo}`}
                alt={restaurant.nameRes}
                className={styles.restaurantImage}
              />
              <h3 className={styles.restaurantName}>{restaurant.nameRes}</h3>
              <p className={styles.restaurantAddress}>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {restaurant.address}
              </p>
              <p className={styles.restaurantCuisine}>
                <FontAwesomeIcon icon={faUtensils} /> {restaurant.cuisineType}
              </p>
            </div>
          ))}
        </Slider>
        <button
          className={styles.closeButton}
          onClick={() => setIsModalOpen(false)}
        >
          Close
        </button>
      </Modal>
    </>
  );
};

export default Header;

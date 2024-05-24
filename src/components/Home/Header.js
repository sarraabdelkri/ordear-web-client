import React, { useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearchSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submit action
    try {
      // Call the backend API to search for a restaurant by name
      const response = await axios.get(`http://localhost:5555/restaurant/search`, {
        params: { nameRes: searchQuery }
      });

      // Navigate to the restaurant details page using the returned restaurant ID
      // Assuming your backend returns the restaurant details including an 'id' field
      if (response.data) {
        navigate(`/search/${response.data._id}`); // Change '_id' based on your actual data structure
      } else {
        alert('Restaurant not found. Please try a different name.');
      }
    } catch (error) {
      console.error('Error searching for restaurant:', error);
      alert('Error searching for the restaurant. Please try again.');
    }
};



  return (
    <>
      <header className="header">
        <section className="slider_section">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto" style={{ marginTop: "100px", fontWeight: "lighter", textAlign: "center" }}>
                <div className="detail-box">
                  <h1>Discover Restaurant And Food</h1>
                  <p>when looking at its layout. The point of using Lorem Ipsum</p>
                </div>
                <div className="find_container">
                  <div className="container">
                    <div className="row">
                      <div className="col" style={{ display: "flex", justifyContent: "center" }}>
                      <form onSubmit={handleSearchSubmit} style={{ width: "100%", maxWidth: "600px", display: "flex", alignItems: "center" }}>
  <div className="form-group" style={{ flex: "1", marginRight: "10px" }}>
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      style={{ borderRadius: "30px", border: "2px solid transparent", fontWeight: "bold", fontSize: "14px", width: "100%", padding: "10px", boxSizing: "border-box" }}
      placeholder="Cuisine Type, Restaurant Name, Address"
    />
  </div>
  <div className="form-group">
    <button type="submit" style={{ borderRadius: "80px", fontWeight: "bold", backgroundColor: "#FA8072", padding: "10px" }}>Search</button>
  </div>
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
                <img src="https://www.myeatpal.com/assets/foods/food_01.png" alt="" style={{ width: '100%', height: 'auto', maxWidth: '300px' }} />
              </div>
            </div>
            <div className="item">
              <div className="img-box">
                <img src="https://www.myeatpal.com/assets/foods/food_04.png" alt="" style={{ width: '100%', height: 'auto', maxWidth: '300px' }} />
              </div>
            </div>
            <div className="item">
              <div className="img-box">
                <img src="https://www.myeatpal.com/assets/dishes/dish_11.png" alt="" style={{ width: '100%', height: 'auto', maxWidth: '300px' }} />
              </div>
            </div>
            <div className="item">
              <div className="img-box">
                <img src="https://www.myeatpal.com/assets/foods/food_00.png" alt="" style={{ width: '100%', height: 'auto', maxWidth: '300px' }} />
              </div>
            </div>
            <div className="item">
              <div className="img-box">
                <img src="https://www.myeatpal.com/assets/foods/food_05.png" alt="" style={{ width: '100%', height: 'auto', maxWidth: '300px' }} />
              </div>
            </div>
          </Slider>
        </section>
      </header>
    </>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import qrcode from "../../assets/qrcode.png";
import ScannerWithCamera from "./ScannerCam";
import { Grid } from "@mui/material";
import Navs from "../Navs/Navs";

const Menu = () => {
  const [scannedData, setScannedData] = useState(null); 
 
  useEffect(() => {
    if (scannedData) {
      fetchRestaurant(scannedData);
    }
  }, [scannedData]);

  const fetchRestaurant = async (data) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/restaurant/retrieve/${data}`
      );
      const restaurantData = await response.json();
      
      console.log("Restaurant Data:", restaurantData);
      // Maintenant vous avez les données du restaurant, vous pouvez faire ce que vous voulez avec elles.
    } catch (error) {
      console.error("Error fetching restaurant:", error);
    }
  };

  const handleScannedData = (data) => {
    setScannedData(data);
  };

  return (
    <div>
      <Navs></Navs>
      <section
        style={{
          backgroundColor: "#AAAA",
          backgroundImage: "#fff",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div>
          <Grid container>
            <br />
            <ScannerWithCamera onScannedData={handleScannedData} />
            <br />
            <br />
            <br />
            <br />
          </Grid>
        </div>
      </section>
    </div>
  );
};

export default Menu;

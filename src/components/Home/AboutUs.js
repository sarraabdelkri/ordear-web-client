import React, { useState, useEffect } from "react";
import axios from "axios"; // Importez axios ici s'il n'est pas déjà importé
import backgroundImage from "../../assets/body-bg.jpg";
import OriginalLogo from "../../assets/logo11.png";
import  "./AboutUs.module.css";
import logo from "../../assets/restaurant-gallery-1.jpg";
import logo2 from "../../assets/restaurant-gallery.jpg";
const AboutUs = ({ theme }) => {
  const [aboutUsInfo, setAboutUsInfo] = useState(null);

  useEffect(() => {
    const fetchAboutUsInfo = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/aboutUs/about`);
        if (!response.status === 200) {
          throw new Error('Failed to fetch about us info');
        }
        const data = response.data;
        console.log(data); // Ajoutez le console.log ici pour afficher les données récupérées
        setAboutUsInfo(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchAboutUsInfo();
  }, []);

  return (
    <section className="py-3 py-md-5 py-xl-8" style={{ backgroundImage: `url(${backgroundImage})`, marginTop: 0 }}>
      <div className="container">
        <div className="row">
          <div className="mt-4 d-flex justify-content-center align-items-center mt-4">
            <h1 className="">About Us</h1>
          </div>
          <div className="d-flex justify-content-center align-items-center text-center">
            <div className="row">
              <div className="col-12 text-center mt-3" style={{ border: "1px solid black", width: 160 }}></div>
            </div>
          </div>
          <br />
          <div className="col-12 col-md-10 col-lg-8">
            {aboutUsInfo && (
              <>
                <h2 className="display-5 mb-4" style={{ marginTop: "30px", marginBottom: "30px", color: "#FA8072" }}>{aboutUsInfo.title}</h2>
                <button type="button" className="btn btn-lg btn-primary mb-3 mb-md-4 mb-xl-5" style={{ backgroundColor: "#FA8072", borderColor: "#FA8072", color: "#ffffff" }}>Connect Now</button>
              </>
            )}
          </div>
        </div>
      </div>
  
      <div className="container">
        <div className="row gy-3 gy-md-4 gy-lg-0">
          <div className="col-12 col-lg-6">
            <div className="card bg-white p-3 m-0" style={{height:"300px"}}>
              <div className="row gy-3 gy-md-0 align-items-md-center">
                <div className="col-md-5">
                  <img src={logo2} className="img-fluid rounded-start" alt="Why Choose Us?" />
                </div>
                <div className="col-md-7">
                  <div className="card-body p-0">
                    <h2 className="card-title h4 mb-3">Our Vision</h2>
                    <p className="card-text lead">{aboutUsInfo && aboutUsInfo.Vision}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6" >
            <div className="card bg-white p-3 m-0" style={{height:"300px"}}>
              <div className="row gy-3 gy-md-0 align-items-md-center">
                <div className="col-md-5">
                  <img src={logo} className="img-fluid rounded-start" alt="Visionary Team" />
                </div>
                <div className="col-md-7" >
                  <div className="card-body p-0">
                    <h2 className="card-title h4 mb-3">Our Values</h2>
                    <p className="card-text lead" >{aboutUsInfo && aboutUsInfo.Values}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

};


export default AboutUs;

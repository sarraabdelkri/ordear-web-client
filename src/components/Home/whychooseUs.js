import React, { useState, useEffect } from "react";
import axios from "axios";
import backgroundImage from "../../assets/body-bg.jpg";

const WhyChooseUs = () => {
  const [whyChooseUsData, setWhyChooseUsData] = useState([]);

  useEffect(() => {
    const fetchWhyChooseUsData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/whyChooseUs//whychooseus`);
        setWhyChooseUsData(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchWhyChooseUsData();
  }, []);

  return (
    <section className="why-us" style={{ backgroundImage: `url(${backgroundImage})`, marginTop: 0 }}>
      <style>
        {`
          .why-us h2 {
            position: relative;
            margin-bottom: 35px;
          }
          .why-us h2::after {
            content: "";
            width: 120px;
            height: 3px;
            display: inline-block;
            background:  #ffffff;
            position: absolute;
            left: 0px;
            right: 0px;
            bottom: -20px;
            margin: 0 auto;
          }

          .why-us .box {
            padding: 50px 30px;
            box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.10);
            transition: 0.5s;
            position: relative;
            background-color: #333;
            max-height: 230px;
            overflow: hidden;
            margin-bottom: 30px;
            border-radius: 10px;
          }
          .why-us .box:hover {
            padding: 30px 30px 70px 30px;
            box-shadow: 10px 15px 30px rgba(0, 0, 0, 0.20);
            background-color: rgba(0, 0, 0, 0.3);
          }
          .why-us .box img {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            z-index: -1;
            opacity: 0;
            transition: all ease 1s; 
          }
          .why-us .box:hover img {
            opacity: 1;
          }
          .why-us .box span {
            display: block;
            font-size: 56px;
            font-weight: 700;
            color: #6b6060;
            position: absolute;
            right: 10px;
            top: 0px;
            line-height: normal;
          }
          .why-us .box h4 a {
            font-size: 24px;
            font-weight: 600;
            padding: 0;
            margin: 20px 0;
            color: #dadada;
            text-decoration: none;
          }
          .why-us .box p {
            color: #aaaaaa;
            font-size: 15px;
            margin: 0;
            padding: 0;
          }
          .why-us .box:hover span,
          .why-us .box:hover h4 a,
          .why-us .box:hover p {
            color: #fff;
          }
        `}
      </style>
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2">
          <div className="mt-4 d-flex justify-content-center align-items-center mt-4">
          <h1 className="" >
          Why Choose Us    </h1>
        </div>
        <div className="d-flex justify-content-center align-items-center text-center">
          <div className="row">
            <div
              className="col-12 text-center mt-3"
              style={{ border: "1px solid black", width: 160 }}
            ></div>
          </div>
        </div>
            <br />
         
            <p className="mb-5 text-center">At Menu, we offer more than just great food. We strive to create an exceptional dining experience that goes beyond the ordinary. Here's why you should choose us:</p>
          </div>
        </div>

        <div className="row">
          {whyChooseUsData.map((item, index) => (
            <div className="col-sm-6 col-lg-4" key={index}>
              <div className="box">
                <span>0{item.number}</span>
                <h2>
                <span style={{ fontSize: "20px", alignItems: "center", color: "#FA8072", display: "flex", justifyContent: "center", alignItems: "center",marginRight:"50px" }}>{item.title}</span>
<br />
                </h2>
                <p>{item.description}</p>
              
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

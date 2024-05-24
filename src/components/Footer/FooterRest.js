import React , { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";
import OriginalLogo from "../../assets/logo44 (1).png";
import BlackLogo from "../../assets/logo55.png";
import WhiteLogo from "../../assets/logo22.png";
import PlayStore from '../../assets/googlePlay.png';
import AppleStore from '../../assets/applestore.png';
import Copyright from "./Copyright";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";


const SimpleFooterRes = ({ theme }) => {
  const [contactInfo, setContactInfo] = useState(null);
  const [error, setError] = useState(null);
  const [usefulLinks, setUsefulLinks] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);
  
  
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/contact/`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch contact info');
        }
        const data = await response.json();
        setContactInfo(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchContactInfo();
  }, []);
  
  const fetchUsefulLinks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/usefulLinks/`);
      if (!response.ok) {
        throw new Error('Failed to fetch useful links');
      }
      const data = await response.json();
      setUsefulLinks(data);
      setError(null); 
    } catch (error) {
      setError(error.message);
      setUsefulLinks([]); 
    }
  };
  

  useEffect(() => {
   
    fetchUsefulLinks();
  }, []);
  
  const selectLogo = () => {
    switch (theme) {
      case 'black':
        return BlackLogo;
      case 'white':
        return WhiteLogo;
      default:
        return OriginalLogo;
    }
  };
  useEffect(() => {
    // Fetch the logo image when the component mounts
    async function fetchLogo() {
      try {
        const response = await fetch("http://localhost:5555/logos/black");
        if (!response.ok) {
          throw new Error("Failed to fetch logo");
        }
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setLogoUrl(imageUrl);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    }

    fetchLogo();
  }, []); 

  return (
    <footer className={styles.footerr}>
      
      <div className="links text-center mt-5">
      <div className="row pt-5 col-12 justify-content-center align-items-center" style={{marginBottom:"-30px"}}>
        <img
          className={styles.logo}
          src={logoUrl} 
          alt="Logo"
          style={{width: "200px"}}
        />
      </div>
      {error && <p>Error: {error}</p>}
      {contactInfo && (
  <div className="contact-info text-center mt-5" style={{marginBottom:"-30px"}}>
    {contactInfo.map(contact => (
      <React.Fragment key={contact._id}>
        <NavLink style={{color:"#fff"}} to="#" className={''}>
          Email: {contact.email} |
        </NavLink>
        <NavLink style={{color:"#fff"}} to="#" className={'text mx-1'}>
          Phone: {contact.phone} |
        </NavLink>
        <NavLink style={{color:"#fff"}} to="#" className={'text mx-1'}>
          Address: {contact.adresse} |
        </NavLink>
      </React.Fragment>
    ))}
  </div>
)}
  {usefulLinks.length > 0 && (
    <div className="links text-center mt-5"  style={{marginBottom:"-50px"}}>
      {usefulLinks.map((link, index) => (
        <NavLink key={index} style={{color:"#fff"}} to={link.url} className={''}>{link.title} |</NavLink>
      ))}
    </div>
  )}
 {contactInfo && (
  <div className="social-links text-center mt-5" style={{marginBottom:"-10px"}}>
    <a href={`https://${contactInfo[0].facebook}`}>
      <FontAwesomeIcon icon={faFacebook} className="social-icon" style={{width:"70px", height:"30px", color:"white", marginTop:"20px"}}/>
    </a>
    <a href={`https://${contactInfo[0].instagram}`}>
      <FontAwesomeIcon icon={faInstagram} className="social-icon" style={{width:"70px", height:"30px", color:"white"}}/>
    </a>
  </div>
)}
</div>


<div className=" mt-4 d-flex justify-content-center align-items-center" style={{marginBottom:"30px"}}>
  {/* Boutons de téléchargement des applications */}
  <img  style={{border:'1px solid white',borderRadius:10, cursor:'pointer'}} width={150} height={60} src={PlayStore} alt=""/>
  <div className="mx-2"></div>
  <img style={{cursor:'pointer', border:'1px solid white', borderRadius:10}} width={150} height={60} src={AppleStore} alt=""/>
</div>


      <Copyright/>
    </footer>
  );
};

export default SimpleFooterRes;

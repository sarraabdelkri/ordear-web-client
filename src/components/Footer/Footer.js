import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";
import OriginalLogo from "../../assets/logo11.png";
import PlayStore from '../../assets/googlePlay.png';
import AppleStore from '../../assets/applestore.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faMapMarkerAlt, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Copyright from "./Copyright";
import { faLink } from "@fortawesome/free-solid-svg-icons";

const Footer = ({ theme }) => {
  const [contactInfo, setContactInfo] = useState(null);
  const [error, setError] = useState(null);
  const [usefulLinks, setUsefulLinks] = useState([]);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/contact/`);
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

return (
    <footer className={styles.footer}>
        <div className="container p-4">
            <div className="row my-5">
                {/* Logo and Description Column */}
                <div className="col-lg-3 col-md-6 mb-5 mb-md-0 text-center" style={{marginLeft:"-10%"}}>
                    <div className="rounded-circle bg-white shadow-1-strong d-flex align-items-center justify-content-center mb-4 mx-auto" style={{ width: '150px', height: '150px' }}>
                        <img src={OriginalLogo} height="70" alt="Logo" loading="lazy" />
                    </div>
                    <p>The Menufy: Discover the Finest Dining, Coffee, and More</p>
                </div>

                {/* Contact Info Column */}
                <div className="col-lg-3 col-md-6 mb-4 mb-md-0"style={{marginLeft:"10%",marginTop:"-0%"}}>
                    <h5 className="text-uppercase mb-4">Contact</h5>
                    {contactInfo && contactInfo.map(contact => (
                        <ul className="list-unstyled" key={contact._id}>
                            <li><p><FontAwesomeIcon icon={faMapMarkerAlt} /> {contact.adresse}</p></li>
                            <li><p><FontAwesomeIcon icon={faPhone} /> {contact.phone}</p></li>
                            <li><p><FontAwesomeIcon icon={faEnvelope} /> {contact.email}</p></li>
                        </ul>
                    ))}
                </div>

                {/* Useful Links Column */}
                <div className="col-lg-3 col-md-6 mb-4 mb-md-0"style={{marginLeft:"10%"}}>
                    <h5 className="text-uppercase mb-4">Useful Links</h5>
                    {usefulLinks.length > 0 && (
                        <ul className="list-unstyled">
                            {usefulLinks.map((link, index) => (
                                <li key={index}><NavLink to={link.url} className="text-white"><FontAwesomeIcon icon={faLink} /> {link.title}</NavLink></li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Social Media and Store Links Column */}
                <div className="col-lg-3 col-md-6 mb-4 mb-md-0 text-center"style={{marginRight:"-10%"}}>
                    <h5 className="text-uppercase mb-4">Follow Us</h5>
                    <div className="d-flex flex-column align-items-center">
                        <a className="text-white px-2" href={`https://${contactInfo ? contactInfo[0].facebook : '#'}`}>
                            <FontAwesomeIcon icon={faFacebook} style={{ color: "#3b5998", fontSize: "24px" }} />
                        </a>
                        <a className="text-white px-2" href={`https://${contactInfo ? contactInfo[0].instagram : '#'}`}>
                            <FontAwesomeIcon icon={faInstagram} style={{ color: "#E1306C", fontSize: "24px" }} />
                        </a>
                    </div>
                    {/* Play Store and Apple Store links */}
                    <div className="mt-3">
                        <img style={{ border: '1px solid white', borderRadius: 10, cursor: 'pointer' }} width={150} height={60} src={PlayStore} alt="Google Play Store" />
                        <div className="mx-2"></div>
                        <img style={{ cursor: 'pointer', border: '1px solid white', borderRadius: 10 }} width={150} height={60} src={AppleStore} alt="Apple Store" />
                    </div>
                </div>
            </div>
            <div className="text-center p-3">
                <Copyright />
            </div>
        </div>
    </footer>
);

};

export default Footer;

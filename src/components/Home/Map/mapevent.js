import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import L from "leaflet";
import "./mapevent.css";
import LeafletGeocoder from "./LeafletGeocoder";
import backgroundImage from "../../../assets/body-bg.jpg";
import LeafletRoutingMachine from "./LeafletRoutingMachine";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom'; 
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



function Mapevent() {
  const position = [43.59529281556225, -79.6962195316418];
  const [events, setEvents] = useState([]);
  const [contactInfo, setContactInfo] = useState([]);

  let DefaultIcon = L.icon({
    iconUrl: process.env.PUBLIC_URL + "/localistation.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -35],
  });

  L.Marker.prototype.options.icon = DefaultIcon;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/contact/`);
        setContactInfo(response.data); // Mettre à jour les données de contact
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section className="py-3 py-md-5 py-xl-8" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', margin: 0, padding: '20px 0' }}>
      <div className="container text-center">
        <h1>Contact Us</h1>
        <hr style={{ margin: '20px auto', width: '250px', border: '1px solid black' ,marginBottom:"60px"}} />
      </div>

         
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9">

            <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '350px', width: '100%' }}>

                    <TileLayer
                url='http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}'
                maxZoom={20}
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              />
                <LeafletGeocoder />
                <LeafletRoutingMachine />
              </MapContainer>
            </div>
      
            <div className="col-md-3 mt-3">
  <ul className="list-unstyled">
    {contactInfo.map(contact => (
      <li key={contact._id} className="mb-3">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <FontAwesomeIcon icon={faMapMarkerAlt} className="fa-2x text-salmon" style={{ color: "#FA8072", marginRight: '10px' ,height: '25px', width: '10%'}} />
          <div>
            <strong>Location:</strong>
            <p>{contact.adresse}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <FontAwesomeIcon icon={faPhone} className="fa-2x text-salmon" style={{ color: "#FA8072", marginRight: '10px',height: '25px', width: '10%' }} />
          <div>
            <strong>Call:</strong>
            <p>{contact.phone}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <FontAwesomeIcon icon={faEnvelope} className="fa-2x text-salmon" style={{ color: "#FA8072", marginRight: '10px',height: '25px', width: '10%' }} />
          <div>
            <strong>Email:</strong>
            <p>{contact.email}</p>
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>

                </div>
        </div>
    </section>
  );
}

export default Mapevent;

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
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Mapevent() {
  const position = [43.59529281556225, -79.6962195316418];
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
        <hr style={{ margin: '20px auto', width: '250px', border: '1px solid black', marginBottom: "60px" }} />
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9 mb-4">
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

          <div className="col-md-3">
            <ul className="list-unstyled">
              {contactInfo.map(contact => (
                <li key={contact._id} className="mb-4">
                  <div className="contact-item" style={{marginTop:"-1%"}} >
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="fa-2x text-salmon" style={{ color: "#FA8072", marginRight: '20px' ,marginTop:"20%" }} />
                    <div style={{marginTop:"20%" , marginRight: '20px'}}>
                      <strong>Location:</strong>
                      </div>
                      <div style={{marginTop:"20%"}}>
                      <p>{contact.adresse}</p>
                    </div>
                  </div>

                  <div className="contact-item" style={{marginTop:"10%"}}>
                    <FontAwesomeIcon icon={faPhone} className="fa-2x text-salmon" style={{ color: "#FA8072", marginRight: '10px', marginTop:"20%" }} />
                    <div style={{marginTop:"20%" , marginRight: '20px'}}>
                      <strong>Call:</strong>
                      </div>
                      <div style={{marginTop:"20%"}}>
                      <p>{contact.phone}</p>
                    </div>
                  </div>

                  <div className="contact-item" style={{marginTop:"10%"}}>
                    <FontAwesomeIcon icon={faEnvelope} className="fa-2x text-salmon" style={{ color: "#FA8072", marginRight: '10px' ,marginTop:"20%" }} />
                    <div style={{marginTop:"20%" , marginRight: '20px'}}>
                      <strong>Email:</strong>
                      </div>
                      <div style={{marginTop:"20%"}}>
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

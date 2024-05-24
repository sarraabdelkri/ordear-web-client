import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import axios from "axios";
import { useMap } from "react-leaflet";

const LeafletRoutingMachine = () => {
  const map = useMap();
  const [events, setEvents] = useState([]);

  let DefaultIcon = L.icon({
    iconUrl: "/logo5.png",
    iconSize: [50, 50],
  });
  let MyIcon = L.icon({
    iconUrl: "/localistation.png",
    iconSize: [24, 21],
  });
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/contact/`);
        setEvents(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    let currentLocationMarker = null;
    let watchID = null;

    // Register a function to be called every time the user's position changes
    watchID = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);

        if (currentLocationMarker) {
          currentLocationMarker.setLatLng([latitude, longitude]);
        } else {
          currentLocationMarker = L.marker([latitude, longitude], {
            icon: MyIcon,
          }).addTo(map);
        }

        const eventLocations = events.map((event) => L.latLng(event.localisation));

        // const routingControl = L.Routing.control({
        //   waypoints: [L.latLng(latitude, longitude), ...eventLocations],
        //   lineOptions: {
        //     styles: [
        //       {
        //         color: "blue",
        //         weight: 4,
        //         opacity: 0.7,
        //       },
        //     ],
        //   },
        //   routeWhileDragging: false,
        //   // geocoder: L.Control.Geocoder.nominatim(),
        //   addWaypoints: false,
        //   draggableWaypoints: false,
        //   fitSelectedRoutes: true,
        //   showAlternatives: true,
        // })
        //   .on("routesfound", function (e) {
        //     e.routes[0].coordinates.forEach((c, i) => {
        //       setTimeout(() => {
        //         currentLocationMarker.setLatLng([c.lat, c.lng]);
        //       }, 1000 * i);
        //     });
        //   })
        //   .addTo(map);

        events.forEach((event) => {
          const marker = L.marker(event.localisation, {
            icon: DefaultIcon,
            
          }).addTo(map);
          marker.bindPopup(`<b>${event.phone}</b><br>${event.email}`);
        });
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => {
      // Stop watching for changes when the component unmounts
      navigator.geolocation.clearWatch(watchID);
    };
  }, [events]);

  return null;
};

export default LeafletRoutingMachine;

import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TrackOrder = ({ order }) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize the map when the component mounts and we have the necessary data
    if (
      mapRef.current &&
      order &&
      order.pickupLocation &&
      order.pickupLocation.coordinates &&
      order.dropoffLocation &&
      order.dropoffLocation.coordinates
    ) {
      const sourceCoordinates = {
        lat: order.pickupLocation.coordinates[1],
        lng: order.pickupLocation.coordinates[0],
      };
      const destCoordinates = {
        lat: order.dropoffLocation.coordinates[1],
        lng: order.dropoffLocation.coordinates[0],
      };

      const map = L.map(mapRef.current).setView([sourceCoordinates.lat, sourceCoordinates.lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      L.marker([sourceCoordinates.lat, sourceCoordinates.lng])
        .addTo(map)
        .bindPopup('Pickup Location');

      L.marker([destCoordinates.lat, destCoordinates.lng])
        .addTo(map)
        .bindPopup('Dropoff Location');

      // Create driver marker.  Important to create it *before* the socket listener.
      driverMarkerRef.current = L.marker([0, 0]).addTo(map).bindPopup('Driver Location');

      // Connect to the server via Socket.io
      socketRef.current = io('http://localhost:5000');
      // Listen for driver location updates, but only if a driver is assigned.
      if (order.deliveryPartner) {
        socketRef.current.on('updateDriverLocation', (location) => {
          setDriverLocation(location);
          if (driverMarkerRef.current) {
             try {
                driverMarkerRef.current.setLatLng([location.lat, location.lng]);
             } catch (error) {
                console.error("Error setting driver marker location:", error);
                console.log("Received location data:", location);
             }
          }
        });
      }
    }

    return () => {
      // Clean up the socket connection when the component unmounts
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [order]);

  useEffect(() => {
    if (driverLocation && driverMarkerRef.current) {
      driverMarkerRef.current.setLatLng([driverLocation.lat, driverLocation.lng]);
    }
  }, [driverLocation]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '400px' }}>
    </div>
  );
};

export default TrackOrder;
